library "SimpleArtifact" version '0.0.1'

using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers

context Patient

define "Is Child":
  AgeInYears() <= 17

define "MeetsInclusionCriteria":
  "Is Child"

define "InPopulation":
  "MeetsInclusionCriteria"

define "Recommendation":
  if "InPopulation" then 'Have Fun!'
    else null

define "Rationale":
  if "InPopulation" then null
    else null

define "Links":
  if "InPopulation" then null
    else null

define "Errors":
  null