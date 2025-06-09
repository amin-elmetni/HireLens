package com.amin.backend.repositories.custom

import com.amin.backend.dtos.ResumeFilterOptionsDto
import com.amin.backend.models.ResumeMetadata
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.aggregation.Aggregation
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Repository

@Repository
class ResumeMetadataCustomRepositoryImpl(
    @Autowired private val mongoTemplate: MongoTemplate
) : ResumeMetadataCustomRepository {

    override fun getFilterOptions(): ResumeFilterOptionsDto {
        val collectionName = "resumes"

        // Skills Count
        val skillsAgg = Aggregation.newAggregation(
            Aggregation.unwind("skills"),
            Aggregation.project()
                .andExpression("toLower(skills.name)").`as`("normalizedName"),
            Aggregation.group("normalizedName").count().`as`("count"),
            Aggregation.project("count").and("_id").`as`("label")
        )

        val skillResults = mongoTemplate.aggregate(skillsAgg, collectionName, Map::class.java)
        val skills = skillResults.mapNotNull {
            val name = it["label"]?.toString() ?: return@mapNotNull null
            val count = (it["count"] as? Number)?.toInt() ?: 0
            mapOf("label" to name, "count" to count)
        }


        // Categories Count
        val categoryAgg = Aggregation.newAggregation(
            Aggregation.unwind("categories"),
            Aggregation.group("categories.name").count().`as`("count"),
            Aggregation.project("count").and("_id").`as`("label")
        )
        val categoryResults = mongoTemplate.aggregate(categoryAgg, collectionName, Map::class.java)
        val categories = categoryResults.mapNotNull {
            val name = it["label"]?.toString() ?: return@mapNotNull null
            val count = (it["count"] as? Number)?.toInt() ?: 0
            mapOf("label" to name, "count" to count)
        }

        // Languages Count
        val languageAgg = Aggregation.newAggregation(
            Aggregation.unwind("languages"),
            Aggregation.group("languages").count().`as`("count"),
            Aggregation.project("count").and("_id").`as`("label")
        )
        val languageResults = mongoTemplate.aggregate(languageAgg, collectionName, Map::class.java)
        val languages = languageResults.mapNotNull {
            val name = it["label"]?.toString() ?: return@mapNotNull null
            val count = (it["count"] as? Number)?.toInt() ?: 0
            mapOf("label" to name, "count" to count)
        }

        // Experience Range
        val expAgg = Aggregation.newAggregation(
            Aggregation.project("years_of_experience")
        )
        val expResults = mongoTemplate.aggregate(expAgg, collectionName, Map::class.java)
        val experiences = expResults.mapNotNull { it["years_of_experience"] as? Int }

        return ResumeFilterOptionsDto(
            skills = skills.sortedBy { it["label"].toString() },
            categories = categories.sortedBy { it["label"].toString() },
            languages = languages.sortedBy { it["label"].toString() },
            minExperience = experiences.minOrNull() ?: 0,
            maxExperience = experiences.maxOrNull() ?: 0
        )
    }

    override fun findByFilters(
        categories: List<String>?,
        skills: List<String>?,
        languages: List<String>?,
        expMin: Int?,
        expMax: Int?
    ): List<ResumeMetadata> {

        val query = Query()
        val criteria = mutableListOf<Criteria>()

        if (!categories.isNullOrEmpty()) {
            categories.forEach {
                val regex = "^${Regex.escape(it.replace('_', ' '))}$"
                criteria.add(Criteria.where("categories.name").regex(regex, "i"))
            }
        }

        if (!skills.isNullOrEmpty()) {
            skills.forEach {
                val regex = "^${Regex.escape(it.replace('_', ' '))}$"
                criteria.add(Criteria.where("skills.name").regex(regex, "i"))
            }
        }

        if (!languages.isNullOrEmpty()) {
            languages.forEach {
                val regex = "^${Regex.escape(it)}$"
                criteria.add(Criteria.where("languages").regex(regex, "i"))
            }
        }

        if (expMin != null || expMax != null) {
            val experienceCriteria = Criteria.where("years_of_experience")
            if (expMin != null) experienceCriteria.gte(expMin)
            if (expMax != null) experienceCriteria.lte(expMax)
            criteria.add(experienceCriteria)
        }

        if (criteria.isNotEmpty()) {
            query.addCriteria(Criteria().andOperator(*criteria.toTypedArray()))
        }

        return mongoTemplate.find(query, ResumeMetadata::class.java)
    }

}
