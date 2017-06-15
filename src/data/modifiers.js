module.exports = [
  {
  	id: 'MostRecent',
  	name: 'Most Recent',
  	inputTypes: ['observations'],
  	returnType: 'observation'
  },
  {
  	id: 'ValueComparison',
  	name: 'Value Comparison',
  	inputTypes: ['observations'],
  	returnType: 'observations',
  	values: {min: undefined}
  },
  {
  	id: 'Exists',
  	name: 'Exists',
  	inputTypes: ['observations', 'observation'],
  	returnType: 'boolean'
  },
]