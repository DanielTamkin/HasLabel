function contains(label, payload, search) {
  /**
   * Search the labels list embeded in the pull_request
   * payload, set to false if you are checking if a specific
   * value was removed.
   * @NOTE: A later feature. Currently the unlabeled
   * event will incorrectly trigger on labels not in the list of
   * labels, due to the fact there is no state.
   * @type {Settings}
   */
  // search = (search !== undefined) ? search : true;

  const payloadLabel = payload.label;
  if (payloadLabel !== undefined && payloadLabel.name.includes(label)) {
    return true;
  // } else if (payload.pull_request !== undefined && search) {
  } else if (payload.pull_request !== undefined) {
    const labelList = payload.pull_request.labels;
    for (var i = 0; i < labelList.length; i++) {
      if (labelList[i].name.includes(label)) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}
function exact(label, payload) {
  if (payload.name === label) {
    return true;
  } else {
    return false;
  }
}


module.exports = {
  exact,
  contains,
};
