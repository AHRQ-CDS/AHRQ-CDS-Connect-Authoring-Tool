/**
 * Example TemplateInstances
 */
const droppedElements = [
 {
   "id": "age_range",
   "name": "Age Range",
   "category": "Demographics",
   "parameters": [
     {
       "id": "element_name",
       "type": "string",
       "name": "Element Name",
       "value": "name1"
     },
     {
       "id": "min_age",
       "type": "integer",
       "name": "Minimum Age",
       "value": 30
     },
     {
       "id": "max_age",
       "type": "integer",
       "name": "Maximum Age",
       "value": 45
     }
   ],
   "cql": "define ${this.element_name}: AgeInYears()>=${this.min_age} and AgeInYears()<=${this.max_age}",
   "uniqueId": "age_range31"
 },
 {
   "id": "most_recent_observation",
   "name": "Most Recent Observation",
   "category": "Observations",
   "parameters": [
     {
       "id": "element_name",
       "type": "string",
       "name": "Element Name",
       "value": "name2"
     },
     {
       "id": "observation",
       "type": "observation",
       "name": "Observation",
       "value": {
         "id": "ldl_cholesterol",
         "name": "LDL Cholesterol",
         "oid": "2.16.840.1.113883.3.464.1003.198.12.1016",
         "units": {
           "values": [
             "mg/dL"
           ],
           "code": "mg/dL"
         }
       }
     }
   ],
   "cql": "define ${this.element_name}:\n              Last (\n                [Observation: \"${this.observation.name}\"] O\n                  where O.status.value = 'final'\n                  and (\n                    O.valueQuantity.unit.value in {${this.observation.units.values}}\n                    or O.valueQuantity.code.value = ${this.observation.units.code}\n                  )\n                  sort by O.issued\n              )",
   "uniqueId": "most_recent_observation67"
 }
];

export {
  droppedElements
};
