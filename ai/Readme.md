# CV Processing & Text Analysis API

## PostgreSQL Database Configuration

### Creating Function and Trigger

To enable notification for new CVs, execute this SQL script in your PostgreSQL database:

```sql
CREATE OR REPLACE FUNCTION notify_cv_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('cv_changes', NEW.id::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cv_insert_trigger
AFTER INSERT ON document
FOR EACH ROW EXECUTE FUNCTION notify_cv_change();
```

## API Testing with Postman

### Prerequisites

- Have Postman installed
- API running (`uvicorn main:app --reload`)
- Postman collection configured

### Postman Collection to Import

[![Run in Postman](https://run.pstmn.io/button.svg)](https://bold-astronaut-999904.postman.co/workspace/khadija~0d3baa79-f654-42a4-903a-dadf852974f3/collection/23705820-63fa160a-4fe2-450b-b6d4-165ff7f86065?action=share&creator=23705820)

### 1. CV Pipeline Test

**Request:**
```
POST http://localhost:8000/cv-processing/run/full
```

**Expected Response:**
```json
{
  "pipeline": "completed",
  "steps": [
    {
      "step": "extraction",
      "notebook": "01-data-extraction.ipynb",
      "status": "success"
    },
    {
      "step": "add_links",
      "notebook": "02-adding-personal-links.ipynb",
      "status": "success"
    },
    {
      "step": "scoring",
      "notebook": "05-scoring_system.ipynb",
      "status": "success"
    }
  ]
}
```

### 2. Text Analysis Test

**Request:**
```
POST http://localhost:8000/text-analysis/extract
```

**Body:**
```json
{
  "text": "Experienced JavaScript Developer with a strong background in project management and creative design."

}
```

**Expected Response:**
```json
{
  "skills": ["python", "django", "machine learning"],
  "categories": ["Web Development", "Data Science"]
}