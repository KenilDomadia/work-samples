import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

/**
 * Returns a created a mutation
 */
export function createNewMutation({
  name,
  inputFields,
  outputFields,
  mutateAndGetPayload
}) {
  if (!name || !inputFields || !outputFields || !mutateAndGetPayload) {
    throw new Error('missing field in a mutation:', name);
  }
  const augmentedInputFields = {
    ...inputFields
  };
  const augmentedOutputFields = {
    ...outputFields
  };

  const outputType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedOutputFields
  });

  const inputType = new GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: outputType,
    args: {
      input: {
        type: new GraphQLNonNull(inputType)
      }
    },
    resolve: (_, {
      input
    }, info) => Promise.resolve(mutateAndGetPayload(_, input, info)).then(payload => payload)
  };
}
