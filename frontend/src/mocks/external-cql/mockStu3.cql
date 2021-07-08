library "AgeSTU3" version '1'

using FHIR version '3.0.0'

context Patient

define "AgeSTU3":
  AgeInHours() >= 14

define "GenSTU3":
  Patient.gender.value = 'female'

define "MeetsInclusionCriteriaSTU3":
  "AgeSTU3"
  and "GenSTU3"

define "InPopulationSTU3":
   "MeetsInclusionCriteriaSTU3"

define "RecommendationSTU3":
  null

define "RationaleSTU3":
  null
define "ErrorsSTU3":
  null
