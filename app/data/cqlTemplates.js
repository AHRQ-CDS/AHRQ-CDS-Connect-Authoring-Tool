module.exports = {
   AgeRange : `define AgeRange: AgeInYears()>=\$\{this.minInt\} and AgeInYears()<=\$\{this.maxInt\}\n`,
   MostRecentObservation: `define \${this.observation.name\}:
              Last (
                [Observation: "\${this.observation.name\}"] O
                  where O.status.value = 'final'
                  and (
                    O.valueQuantity.unit.value in {\$\{this.observation.units.values\}}
                    or O.valueQuantity.code.value = \$\{this.observation.units.code\}
                  )
                  sort by O.issued
              )\n`
}