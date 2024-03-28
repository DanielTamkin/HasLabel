const { contains, exact } = require('../util.js');

/**
 * Executed when a pull_request or synchronize event is triggerd.
 *
 * @method labeled
 * @param  {String} label Pre-determined by main action file.
 * @param  {Object} tools Toolkit tools,
 * @return {1 or 0}       Returned by .fail or .success
 */
module.exports = async (label, tools) => {
  const { context } = tools;
  let result = false;

  if(tools.inputs.contains) {

    name = contains(label, context.payload)
    if (name !== "") {
      tools.outputs[`labeled-${label}`] = true;
      tools.outputs[`label-name`] = name;
      result = true;
    }

    await tools.exit.success(`${
      (result)
        ? '[CONTAINS] label '+label
        : 'label not added'
    }`);


  } else if (tools.inputs.exact) {

    if (exact(label, context.payload.label)) {
      tools.outputs[`labeled-${label}`] = true;
      result = true;
    }

    await tools.exit.success(`${
      (result)
        ? '[EXACT] Specified label added'
        : 'Specified label not added'
    }`);

  } else {
    await tools.exit.fail('You must specify a label.');
  }
}
