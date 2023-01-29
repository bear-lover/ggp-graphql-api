import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLList as List
} from 'graphql';

const WhyHostType = new ObjectType({
	name: 'WhyHostTypeT',
	fields: {
		id: { type: IntType },
		imageName: { type: StringType },
		title: { type: StringType },
		buttonLabel: { type: StringType },
	}
});

const WhyHostCommonType = new ObjectType({

	name: 'WhyHostCommonTypeT',

	fields: {
		status: {
			type: IntType
		},
		errorMessage: {
			type: StringType
		},
		result: {
			type: WhyHostType
		},
		results: {
			type: new List(WhyHostType)
		},
		dataList: {
			type: new List(WhyHostType)
		},
	}

});

export default WhyHostCommonType;