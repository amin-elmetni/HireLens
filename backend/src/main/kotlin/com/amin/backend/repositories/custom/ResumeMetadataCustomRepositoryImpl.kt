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

    override fun findByCategory(categoryName: String, excludeUuid: String?): List<ResumeMetadata> {
        println("Debug - Repository searching for resumes where '$categoryName' is the TOP category")
        
        // Get all resumes first
        val query = Query()
        if (excludeUuid != null) {
            query.addCriteria(Criteria.where("uuid").ne(excludeUuid))
        }
        
        val allResumes = mongoTemplate.find(query, ResumeMetadata::class.java)
        
        // Filter resumes where the specified category is the top category (highest score)
        val filteredResumes = allResumes.filter { resume ->
            val categories = resume.categories
            if (categories.isNullOrEmpty()) {
                false
            } else {
                // Find the category with the highest score
                val topCategory = categories
                    .filter { it.score != null && it.name != null }
                    .maxByOrNull { it.score!! }
                
                // Check if the top category matches our target category (case-insensitive)
                topCategory?.name?.trim()?.equals(categoryName.trim(), ignoreCase = true) == true
            }
        }
        
        println("Debug - Repository found ${filteredResumes.size} resumes where '$categoryName' is the TOP category")
        
        // Debug: Print the first few results
        filteredResumes.take(5).forEach { resume ->
            val categories = resume.categories
                ?.sortedByDescending { it.score ?: 0.0 }
                ?.map { "${it.name} (${it.score})" }
            val topCat = resume.categories
                ?.filter { it.score != null && it.name != null }
                ?.maxByOrNull { it.score!! }
                ?.name
            println("Debug - Found resume: ${resume.name} with TOP category: '$topCat' - All categories: $categories")
        }
        
        return filteredResumes
    }

}
