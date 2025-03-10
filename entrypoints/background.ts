export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });


  // Function to update dynamic rules
const updateDynamicRules = async (newRules = []) => {
  const oldRules = await browser.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules,
  });
};

// Add dynamic rules to block similar trips
const addNewRules = () => {
  const newRules = [
    {
      id: 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: "similar" },
    },
  ];
  updateDynamicRules(newRules as any);
};

// Remove dynamic rules
const removeOldRules = () => {
  updateDynamicRules();
};

addNewRules();

});


