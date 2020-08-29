const { Toolkit } = require('actions-toolkit')
const { labeled, unlabeled } = require('./events');


Toolkit.run(async tools => {
  const ActionEvent = tools.context.payload.action;
  const label = tools.inputs.contains || tools.inputs.exact;
  /**
   * Trigger labeled event if ActionEvent informs us of a new
   * label or a synchronize event is issued.
   */
  if(ActionEvent === 'labeled' || ActionEvent === 'opened' || ActionEvent === 'synchronize') {
    await labeled(label, tools);
  } else if(ActionEvent === 'unlabeled') {
    await unlabeled(label, tools);
  } else {
    await tools.exit.success('[SKIP] No label events triggered');
  }
});
