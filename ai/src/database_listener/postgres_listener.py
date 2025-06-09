import psycopg2
import psycopg2.extensions
import time
import threading
import logging
from dotenv import load_dotenv
import os
from pathlib import Path

logger = logging.getLogger(__name__)


class PostgresCVListener:
    def __init__(self, db_config):
        # Configuration avec valeurs par défaut si non spécifiées
        self.db_config = {
            'POSTGRES_HOST': db_config.get('POSTGRES_HOST', 'localhost'),
            'POSTGRES_PORT': db_config.get('POSTGRES_PORT', '5432'),
            'POSTGRES_DB': db_config.get('POSTGRES_DB', 'postgres'),
            'POSTGRES_USER': db_config.get('POSTGRES_USER' , 'postgres'),
            'POSTGRES_PASSWORD': db_config.get('POSTGRES_PASSWORD', 'nttdata1234')
        }
        self.conn = None
        self._running = False
        self._thread = None

    def _connect(self):
        """Version alternative avec chaîne de connexion"""
        try:
            conn_str = f"""
                dbname='{self.db_config['POSTGRES_DB']}'
                user='{self.db_config['POSTGRES_USER']}'
                password='{self.db_config['POSTGRES_PASSWORD']}'
                host='{self.db_config['POSTGRES_HOST']}'
                port='{self.db_config['POSTGRES_PORT']}'
            """
            # Log masqué pour la sécurité
            logger.info("Tentative de connexion à PostgreSQL...")

            conn = psycopg2.connect(conn_str)
            logger.info("Connexion PostgreSQL établie avec succès")
            return conn
        except psycopg2.Error as e:
            logger.error(f"Erreur de connexion PostgreSQL: {e}")
            raise
    def listen_to_changes(self):
        """Écoute les changements dans la table documents"""
        self._running = True

        while self._running:
            try:
                if not self.conn or self.conn.closed:
                    self.conn = self._connect()
                    self.conn.set_isolation_level(
                        psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT
                    )

                curs = self.conn.cursor()
                curs.execute("LISTEN cv_changes;")
                logger.info("Listening for CV changes in PostgreSQL...")

                while self._running:
                    if self.conn.closed:
                        break

                    self.conn.poll()
                    while self.conn.notifies and self._running:
                        notify = self.conn.notifies.pop(0)
                        logger.info(f"New CV detected! Document ID: {notify.payload}")
                        # Ici vous pourriez déclencher un traitement

                    time.sleep(1)

            except (psycopg2.OperationalError, psycopg2.InterfaceError) as e:
                logger.error(f"Database connection error: {e}")
                if self.conn and not self.conn.closed:
                    self.conn.close()
                time.sleep(5)  # Attente avant reconnexion
            except Exception as e:
                logger.error(f"Unexpected error: {e}", exc_info=True)
                time.sleep(1)

    def start_listener(self):
        """Démarre le listener dans un thread séparé"""
        if not self._thread or not self._thread.is_alive():
            self._thread = threading.Thread(
                target=self.listen_to_changes,
                daemon=True
            )
            self._thread.start()
            logger.info("Listener PostgreSQL démarré")

    def stop_listener(self):
        """Arrête le listener"""
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)
        if self.conn and not self.conn.closed:
            self.conn.close()
        logger.info("Listener PostgreSQL arrêté")