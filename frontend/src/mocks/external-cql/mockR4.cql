library "AgeR4" version '1'

using FHIR version '4.0.0'

context Patient

define "AgeR4":
  AgeInHours() >= 14

define "GenR4":
  Patient.gender.value = 'female'

define "MeetsInclusionCriteriaR4":
  "AgeR4"
  and "GenR4"

define "InPopulationR4":
   "MeetsInclusionCriteriaR4"

define "RecommendationR4":
  null

define "RationaleR4":
  null
define "ErrorsR4":
  null
