const { contains, exact } = require('../util.js');

module.exports = async (label, tools) => {
  const { context } = tools;
  let result = false;

  if(tools.inputs.contains) {
    name = contains(label, context.payload)
    if (name !== "") {
      tools.outputs[`unlabeled-${label}`] = true;
      tools.outputs[`label-name`] = name;
      result = true;
    }

    await tools.exit.success(`${
      (result)
        ? '[CONTAINS] '+label+' unlabeled'
        : label+' not unlabeled'
    }`);

  } else if (tools.inputs.exact) {
    if (exact(label, context.payload.label)) {
      tools.outputs[`unlabeled-${label}`] = true;
      tools.outputs[`label-name`] = name;
      result = true;
    }

    await tools.exit.success(`${
      (result)
        ? '[EXACT] '+label+' unlabeled'
        :   label+' not unlabeled'
    }`);

  } else {
    await tools.exit.fail('You must specify a label.');
  }
}

// if(tools.inputs.contains) {
//   const label = tools.inputs.contains;
//   let result = false;
//
//   if (!contains(label, context.payload)) {
//     tools.outputs[`unlabeled-${label}`] = true;
//     result = true;
//   }
// } else
