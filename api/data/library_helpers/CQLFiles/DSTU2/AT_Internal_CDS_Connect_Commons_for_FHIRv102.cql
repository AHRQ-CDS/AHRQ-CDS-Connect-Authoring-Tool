// CDS Connect Commons for FHIRv102
// Change log:
// - 1.3.1:
//   - Changed C.dateRecorded to C.dateRecorded.value in ConditionLookBack
//   - Changed G.statusDate to G.statusDate.value in GoalLookBack
// - 1.3.2
//   - Remove NullSafe conversion functions since FHIRHelpers now does null-safe conversions
//   - Add MostRecentCondition
//   - Add MostRecentProcedure
// - 1.3.3
//   - Add functions for the Immunization resource
//   - Add functions for the Device resource
// - 1.3.4
//   - Add functions for First {Observation, Condition, Procedure, Immunization}
//   - Add functions for Average Observation
library AT_Internal_CDS_Connect_Commons_for_FHIRv102 version '1.3.4'

using FHIR version '1.0.2'

// Include the FHIRHelpers library for simplifying interacton w/ the FHIR data model
include FHIRHelpers version '1.0.2' called FHIRHelpers

// -------------------------------------------------- OBSERVATIONS -----------------------------------------------------

/**
 * Filters Observations by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Observations matching the concept, or null if null was passed in
 */
define function ObservationsByConcept(Koncept System.Concept):
  [Observation] O where FHIRHelpers.ToConcept(O.code) ~ Koncept

/**
 * Observations that are complete and verified. In FHIR DSTU2, there are two statuses that indicate this state: 'final'
 * and 'amended'.
 * @see http://hl7.org/fhir/DSTU2/valueset-observation-status.html
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of verified Observations, or null if null was passed in
 */
define function Verified(ObsList List<Observation>):
  ObsList O where O.status.value in {'final', 'amended'}

/**
 * Observations that have quantity values recorded in the requested unit.
 * @param ObsList - a list of Observations
 * @param Unit - the unit to require in the Observations quantity value
 * @returns {List<Observation>} a list of Observations with the required unit, or null if null was passed in
 */
define function WithUnit(ObsList List<Observation>, Unit String):
  ObsList O where O.valueQuantity.unit.value = Unit or O.valueQuantity.code.value = Unit

/**
 * Observations with an effective or issued date in the specified "look back" period.  For example, LDL-C Tests in the
 * last 6 years.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of Observations with effective or issued date specified lookback period, or null
 * if null was passed in
 */
define function ObservationLookBack(ObsList List<Observation>, LookBack System.Quantity):
  ObsList O
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where O.effectiveDateTime.value in LookBackInterval
      or FHIRHelpers.ToInterval(O.effectivePeriod) overlaps LookBackInterval
      or O.issued in LookBackInterval

/**
 * The most recent observation.  For each Observation, this algorithm will use the FindDate function, which uses the
 * first non-null date value from these fields: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * The found date will be used to compare Observations and determine the most recent one.
 * NOTE: We can't use FindDate because it appears that the execution engine may have problems sorting by the
 * result of a function.
 * @see Coalesce(Observation)
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
define function MostRecent(ObsList List<Observation>):
  Last(ObsList O sort by Coalesce(effectiveDateTime.value, effectivePeriod."end".value, effectivePeriod."start".value, issued.value))

/**
 * The First Observation.  For each Observation, this algorithm will use the FindDate function, which uses the
 * first non-null date value from these fields: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * The found date will be used to compare Observations and determine the first one.
 * NOTE: We can't use FindDate because it appears that the execution engine may have problems sorting by the
 * result of a function.
 * @see Coalesce(Observation)
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
 define function FirstObservation(ObsList List<Observation>):
  First(ObsList O sort by Coalesce(effectiveDateTime.value, effectivePeriod."start".value, effectivePeriod."end".value, issued.value))

/**
 * Extracts the quantity value from an Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @returns {System.Quantity} the Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValue(Obs Observation):
  FHIRHelpers.ToQuantity(Obs.valueQuantity)

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  FHIRHelpers.ToConcept(Obs.valueCodeableConcept)

/**
 * Finds the first non-null meaningful date that can be associated with this Observation.  This will look through the
 * following fields in the following order: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * @param Obs - an Observation
 * @returns {System.DateTime} the first non-null meaningful date, or null if non is found
 */
define function FindDate(Obs Observation):
  Coalesce(Obs.effectiveDateTime.value, Obs.effectivePeriod."end".value, Obs.effectivePeriod."start".value, Obs.issued.value)

// TODO: Confirm that this works as expected
/**
 * The highest observation.
 * The value will be used to compare Observations and determine the highest one.
 * @param ObsList - a list of Observations
 * @returns {System.Quantity} the quantity with the highest value from the list, or null if null was passed in
 */
define function HighestObservation(ObsList List<Observation>):
  Max(ObsList O return FHIRHelpers.ToQuantity(O.valueQuantity))

/**
 * The Average Observation Value.
 * The value will be used to calculate the average ValueQuantity of all non-null elements in the observation list .
 * @param ObsList - a list of Observations
 * @returns {System.Quantity} a quantity containing the average of the non-null elements of the list
 * or null if all elements are null.
 */
define function AverageObservation(ObsList List<Observation>):
  Avg(ObsList O return FHIRHelpers.ToQuantity(O.valueQuantity))

// -------------------------------------------------- CONDITIONS -------------------------------------------------------

/**
 * Filters Conditions by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Conditions matching the concept, or null if null was passed in
 */
define function ConditionsByConcept(Koncept System.Concept):
  [Condition] C where FHIRHelpers.ToConcept(C.code) ~ Koncept

/**
 * Conditions that are confirmed. In FHIR DSTU2, this is reflected by verificationStatus: 'confirmed'.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-ver-status.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of confirmed Conditions, or null if null was passed in
 */
define function Confirmed(CondList List<Condition>):
  CondList C where C.verificationStatus.value = 'confirmed'

/**
 * Conditions that are active. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' and the absence of any
 * abatement information (i.e., if it abated, it is no longer active).
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active Conditions, or null if null was passed in
 */
define function ActiveCondition(CondList List<Condition>):
  CondList C
    where C.clinicalStatus.value = 'active'
      and C.abatementDateTime is null
      and C.abatementQuantity is null
      and C.abatementBoolean.value is not true
      and C.abatementPeriod is null
      and C.abatementRange is null
      and C.abatementString is null

/**
 * Conditions that are active or recurring. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' or 'relapse'.
 * We do not check for null abatement information because it may have dates from when the now recurring condition
 * initially went into remission.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active or recurring Conditions, or null if null was passed in
 */
define function ActiveOrRecurring(CondList List<Condition>):
  CondList C where C.clinicalStatus.value in {'active', 'relapse'}

/**
 * Conditions with an onset or recorded date in the specified "look back" period.  For example, pregnancy in
 * the last 42 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of Conditions with onset or recorded date specified lookback period, or null
 * if null was passed in
 */
define function ConditionLookBack(CondList List<Condition>, LookBack System.Quantity):
  CondList C
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where C.onsetDateTime.value in LookBackInterval
      or FHIRHelpers.ToInterval(C.onsetPeriod) overlaps LookBackInterval
      or C.dateRecorded.value in LookBackInterval

/**
 * The most recent condition.  For each Condition, this algorithm will use the Coalesce function, which uses the
 * first non-null result from these fields: onsetDateTime, onsetPeriod.end, onsetPeriod.start, dateRecorded.
 * The found date will be used to compare Conditions and determine the most recent one.
 * @param CondList - a list of Conditions
 * @returns {Condition} the most recent Condition from the list, or null if null was passed in
 */
define function MostRecentCondition(CondList List<Condition>):
  Last(CondList C sort by Coalesce(onsetDateTime.value, onsetPeriod."end".value, onsetPeriod."start".value, dateRecorded.value))

/**
 * The First condition.  For each Condition, this algorithm will use the Coalesce function, which uses the
 * first non-null result from these fields: onsetDateTime, onsetPeriod.end, onsetPeriod.start, dateRecorded.
 * The found date will be used to compare Conditions and determine the most recent one.
 * @param CondList - a list of Conditions
 * @returns {Condition} the most recent Condition from the list, or null if null was passed in
 */
define function FirstCondition(CondList List<Condition>):
  First(CondList C sort by Coalesce(onsetDateTime.value, onsetPeriod."start".value, onsetPeriod."end".value, dateRecorded.value))

// -------------------------------------------------- PROCEDURES -------------------------------------------------------

 /**
  * Filters Procedures by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
  * but for now, we must use a query where clause.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<Procedure>} a list of Procedures matching the concept, or null if null was passed in
  */
 define function ProceduresByConcept(Koncept System.Concept):
   [Procedure] P where FHIRHelpers.ToConcept(P.code) ~ Koncept

/**
 * Procedures that are completed. In FHIR DSTU2, this is reflected by status: 'completed'.  In addition, the
 * notPerformed flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function Completed(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'completed'
      and P.notPerformed.value is not true

/**
 * Procedures that are in progress. In FHIR DSTU2, this is reflected by status: 'in-progress'.  In addition, the
 * notPerformed flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function ProcedureInProgress(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'in-progress'
      and P.notPerformed.value is not true

/**
 * Procedures that actually happened or are happening. In FHIR DSTU2, there are a few properties that negate the
 * procedure, most notably when status is 'entered-in-error' or notPerformed is true.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of Procedures that actually happened or are happening, or null if null was passed in
 */
define function ProcedurePerformance(ProcList List<Procedure>):
  ProcList P
    where P.status.value != 'entered-in-error'
      and P.notPerformed.value is not true

/**
 * Procedures performed in the specified "look back" period.  For example, PCIs performed in the
 * past 2 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ProcList - a list of Procedures
 * @param LookBack - the lookback period for when the procedure was performed
 * @returns {List<Procedure>} a list of Procedures performed in the look back period, or null if null
 * was passed in
 */
define function ProcedureLookBack(ProcList List<Procedure>, LookBack System.Quantity):
  ProcList P
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where P.performedDateTime.value in LookBackInterval
      or FHIRHelpers.ToInterval(P.performedPeriod) overlaps LookBackInterval

/**
 * The most recent procedure.  For each Procedure, this algorithm will use the Coalesce function, which returns the
 * first non-null result from these fields: performedDateTime, performedPeriod.end, performedPeriod.start.
 * The found date will be used to compare Procedures and determine the most recent one.
 * @param ProcList - a list of Procedures
 * @returns {Procedure} the most recent Procedure from the list, or null if null was passed in
 */
define function MostRecentProcedure(ProcList List<Procedure>):
  Last(ProcList P sort by Coalesce(performedDateTime.value, performedPeriod."end".value, performedPeriod."start".value))

/**
 * The First procedure.  For each Procedure, this algorithm will use the Coalesce function, which returns the
 * first non-null result from these fields: performedDateTime, performedPeriod.end, performedPeriod.start.
 * The found date will be used to compare Procedures and determine the first one.
 * @param ProcList - a list of Procedures
 * @returns {Procedure} the most recent Procedure from the list, or null if null was passed in
 */
define function FirstProcedure(ProcList List<Procedure>):
  First(ProcList P sort by Coalesce(performedDateTime.value, performedPeriod."start".value, performedPeriod."end".value))


// ---------------------------------------------- PROCEDUREREQUESTS ----------------------------------------------------

 /**
  * Filters ProcedureRequests by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
  * but for now, we must use a query where clause.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<ProcedureRequest>} a list of ProcedureRequests matching the concept, or null if null was passed in
  */
 define function ProcedureRequestsByConcept(Koncept System.Concept):
   [ProcedureRequest] P where FHIRHelpers.ToConcept(P.code) ~ Koncept

/**
 * ProcedureRequests that are accepted, in progress, or completed. In FHIR DSTU2, this is reflected by the corresponding
 * status status values.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-request-status.html
 * @param ProcReqList - a list of ProcedureRequests
 * @returns {List<ProcedureRequest>} a list of accepted, in-progress, or completed ProcedureRequests,
 * or null if null was passed in
 */
define function ProcedureRequestAcceptedOrInProgressOrCompleted(ProcReqList List<ProcedureRequest>):
  ProcReqList P
    where P.status.value in List{'accepted', 'in-progress', 'completed'}

/**
 * ProcedureRequests ordered in the specified "look back" period.  For example, PCIs ordered in the
 * past 2 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ProcReqList - a list of ProcedureRequests
 * @param LookBack - the lookback period for when the procedure was ordered
 * @returns {List<ProcedureRequest>} a list of ProcedureRequests ordered in the look back period, or null if null
 * was passed in
 */
define function ProcedureRequestLookBack(ProcReqList List<ProcedureRequest>, LookBack System.Quantity):
  ProcReqList P
    where P.orderedOn.value in Interval[Now() - LookBack, Now()]

// ----------------------------------------------- REFERRALREQUESTS ----------------------------------------------------

 /**
  * Filters ReferralRequests by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
  * but for now, we must use a query where clause.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<ReferralRequest>} a list of ReferralRequests matching the concept, or null if null was passed in
  */
 define function ReferralRequestsByServiceRequestedConcept(Koncept System.Concept):
   [ReferralRequest] R
   where exists((R.serviceRequested) SRC where FHIRHelpers.ToConcept(SRC) ~ Koncept)

/**
 * ReferralRequests that are accepted, active, or completed. In FHIR DSTU2, this is reflected by the corresponding
 * status status values.
 * @see http://hl7.org/fhir/DSTU2/valueset-referralstatus.html
 * @param ReferralList - a list of ReferralRequests
 * @returns {List<ReferralRequest>} a list of accepted, active, or completed ReferralRequests,
 * or null if null was passed in
 */
define function ReferralRequestAcceptedOrActiveOrCompleted(ReferralList List<ReferralRequest>):
  ReferralList R
    where R.status.value in List{'accepted', 'active', 'completed'}

/**
 * ReferralRequests requested in the specified "look back" period.  For example, pace make insertions referrals sent
 * in the past 2 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ReferralList - a list of ReferralRequests
 * @param LookBack - the lookback period for when the referral was sent
 * @returns {List<ReferralRequest>} a list of ReferralRequests sent in the look back period, or null if null
 * was passed in
 */
define function ReferralRequestLookBack(ReferralList List<ReferralRequest>, LookBack System.Quantity):
  ReferralList R
    where R.dateSent.value in Interval[Now() - LookBack, Now()]

// -------------------------------------------------- MEDICATIONS ------------------------------------------------------

/**
 * Filters MedicationStatements by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationStatement>} a list of MedicationStatement matching the concept, or null if null was passed in
 */
define function MedicationStatementsByConcept(Koncept System.Concept):
  [MedicationStatement] M where FHIRHelpers.ToConcept(M.medicationCodeableConcept) ~ Koncept

/**
 * Filters MedicationOrders by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationOrder>} a list of MedicationOrders matching the concept, or null if null was passed in
 */
define function MedicationOrdersByConcept(Koncept System.Concept):
  [MedicationOrder] M where FHIRHelpers.ToConcept(M.medicationCodeableConcept) ~ Koncept

/**
 * Medications that are active, according to a statement, but not necessarily verified via a prescription.  For example,
 * medications that a patient has self-reported to be taking.  In FHIR DSTU2, this is reflected by MedicationStatement
 * with status 'active', no flag indicating it wasn't taken, and no end date or an end date in the future.
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-medication-statement-status.html
 * @param MedList - a list of MedicationStatements
 * @returns {List<MedicationStatement>} a list of active medication statements, or null if null was passed in
 */
define function ActiveMedicationStatement(MedList List<MedicationStatement>):
  MedList M
    let EffectivePeriod: FHIRHelpers.ToInterval(M.effectivePeriod)
    where M.status.value = 'active'
      and M.wasNotTaken.value is not true
      and (end of EffectivePeriod is null or end of EffectivePeriod after Now())

/**
* Medications that are active, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
* with status 'active' and no dateEnded.  There is currently an open question in the FHIR chat to determine if this
* is the right approach.
* TODO: Revisit based on outcome of FHIR chat.
* TODO: Rename to Active once the execution engine supports overloaded functions.
* @see https://chat.fhir.org/#narrow/stream/implementers/topic/Meaning.20of.20.22active.22.20and.20.22completed.22.20in.20MedicationRequest
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      and M.dateEnded.value is null

/**
* Medications that are active or completed, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
* with status 'active' or 'completed'
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveOrCompletedMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      or M.status.value = 'completed'

/**
* Medications that are active, completed, or stopped, according to a prescription.  In FHIR DSTU2, this is reflected by
* MedicationOrder with status 'active', 'completed', or 'stopped'
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveCompletedOrStoppedMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      or M.status.value = 'completed'
      or M.status.value = 'stopped'

/**
 * MedicationStatement with an effective date in the specified "look back" period.  For example, statements about opioid
 * use in the last 180 days.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param MedList - a list of MedicationStatements
 * @param LookBack - a duration Quantity indicating how far back to look for MedicationStatements
 * @returns {List<MedicationStatement>} a list of MedicationStatements with effective date in the specified lookback
 * period, or null if null was passed in
 */
define function MedicationStatementLookBack(MedList List<MedicationStatement>, LookBack System.Quantity):
  MedList M
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where M.effectiveDateTime.value in LookBackInterval
      or FHIRHelpers.ToInterval(M.effectivePeriod) overlaps LookBackInterval

/**
 * MedicationOrders with a written date in the specified "look back" period.  For example, opioid orders in the last
 * 180 days.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param OrderList - a list of MedicationOrders
 * @param LookBack - a duration Quantity indicating how far back to look for MedicationOrders
 * @returns {List<MedicationOrder>} a list of MedicationOrders with written date in the specified lookback period,
 * or null if null was passed in
 */
define function MedicationOrderLookBack(MedList List<MedicationOrder>, LookBack System.Quantity):
  MedList M where M.dateWritten.value in Interval[Now() - LookBack, Now()]

// -------------------------------------------------- ENCOUNTERS ------------------------------------------------------

/**
 * Filters Encounters by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Encounter>} a list of Encounters matching the concept, or null if null was passed in
 */
define function EncountersByConcept(Koncept System.Concept):
  [Encounter] E where exists( (E.type) ET where FHIRHelpers.ToConcept(ET) ~ Koncept )

/**
 * Encounters that are in progress. In FHIR DSTU2, this is reflected by status: 'in-progress'.
 * @see http://hl7.org/fhir/DSTU2/valueset-encounter-state.html
 * @param EncList - a list of Encounters
 * @returns {List<Encounter>} a list of in progress encounters, or null if null was passed in
 */
define function InProgress(EncList List<Encounter>):
  EncList E
    where E.status.value = 'in-progress'

// -------------------------------------------------- ALLERGY INTOLERANCES ---------------------------------------------

/**
 * Filters AllergyIntolerances by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<AllergyIntolerance>} a list of Allergy Intolerances matching the concept, or null if null was passed in
 */
define function AllergyIntolerancesByConcept(Koncept System.Concept):
  [AllergyIntolerance] A where FHIRHelpers.ToConcept(A.substance) ~ Koncept

/**
* AllergyIntolerances that are active or confirmed.  In FHIR DSTU2, this is reflected by AllergyIntolerance
* with status 'active' or 'confirmed'
* @see http://hl7.org/fhir/DSTU2/valueset-allergy-intolerance-status.html
* @param AllergyIntolList - a list of AllergyIntolerances
* @returns {List<AllergyIntolerance>} a list of active or confirmed allergy intolerances, or null if null was passed in
*/
define function ActiveOrConfirmedAllergyIntolerance(AllergyIntolList List<AllergyIntolerance>):
  AllergyIntolList A
    where A.status.value = 'active'
      or A.status.value = 'confirmed'

// -------------------------------------------------------- GOALS ------------------------------------------------------

/**
 * Goals with a start, target, or status date in the specified "look back" period.  For example, Pain Management Goals
 * in the last 2 years.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param GoalList - a list of Goals
 * @returns {List<Goal>} a list of Goals with a start, target, or status date in the specified lookback period, or null
 * if null was passed in
 */
define function GoalLookBack(GoalList List<Goal>, LookBack System.Quantity):
  GoalList G
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where G.startDate.value in LookBackInterval
      or G.targetDate.value in LookBackInterval
      or (G.startDate.value + FHIRHelpers.ToQuantity(G.targetQuantity)) in LookBackInterval
      or G.statusDate.value in LookBackInterval

// -------------------------------------------------- Immunizations ----------------------------------------------------

 /**
  * Filters Immunizations by a concept rather than by a ValueSet.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<Immunization>} a list of Immunizations matching the concept, or null if null was passed in
  */
 define function ImmunizationsByConcept(Koncept System.Concept):
   [Immunization] I where FHIRHelpers.ToConcept(I.vaccineCode) ~ Koncept

/**
 * Immunizations that are completed. In FHIR DSTU2, this is reflected by status: 'completed'.  In addition, the
 * wasNotGiven flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-medication-admin-status.html
 * @param ImmunizationList - a list of Immunizations
 * @returns {List<Immunization>} a list of completed Immunizations, or null if null was passed in
 */
define function CompletedImmunization(ImmunizationList List<Immunization>):
  ImmunizationList I
    where I.status.value = 'completed'
      and I.wasNotGiven.value is not true

/**
 * Immunizations given in the specified "look back" period.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ImmunizationList - a list of Immunizations
 * @param LookBack - the lookback period for when the immunization was given
 * @returns {List<Immunization>} a list of Immunizations given in the look back period, or null if null
 * was passed in
 */
define function ImmunizationLookBack(ImmunizationList List<Immunization>, LookBack System.Quantity):
  ImmunizationList I
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where I.date.value in LookBackInterval

/**
 * The most recent Immunization.
 * @param ImmunizationList - a list of Immunizations
 * @returns {Immunization} the most recent Immunization from the list, or null if null was passed in
 */
define function MostRecentImmunization(ImmunizationList List<Immunization>):
  Last(ImmunizationList I sort by date.value)

/**
 * The First Immunization.
 * @param ImmunizationList - a list of Immunizations
 * @returns {Immunization} the most recent Immunization from the list, or null if null was passed in
 */
define function FirstImmunization(ImmunizationList List<Immunization>):
  First(ImmunizationList I sort by date.value)


// ----------------------------------------------------- Devices -------------------------------------------------------

 /**
  * Filters Devices by a concept rather than by a ValueSet.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<Device>} a list of Devices matching the concept, or null if null was passed in
  */
 define function DevicesByConcept(Koncept System.Concept):
   [Device] D where FHIRHelpers.ToConcept(D.type) ~ Koncept

/**
 * Devices that are active. In FHIR DSTU2, this is reflected by status: 'available'.
 * @see http://hl7.org/fhir/DSTU2/valueset-devicestatus.html
 * @param DeviceList - a list of Devices
 * @returns {List<Device>} a list of active Devices, or null if null was passed in
 */
define function ActiveDevice(DeviceList List<Device>):
  DeviceList D
    where D.status.value = 'available'
