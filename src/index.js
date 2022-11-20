/**
 * @param {import("@textlint/types").TextlintRuleContext} context
 * @param {import("@textlint/types").TextlintRuleOptions<{ allows?: string[]}>} options
 * @returns {import("@textlint/types").TextlintRuleCreator}
 */
export default function (context, options = {}) {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    return {
        [Syntax.Str](node) { // "Str" node
            const text = getSource(node); // Get text
            if (allows.some(allow => text.includes(allow))) {
                return;
            }
            const matches = text.matchAll(/bugs/g);
            for (const match of matches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length];
                const ruleError = new RuleError("Found bugs.", {
                    padding: locator.range(matchRange)
                });
                report(node, ruleError);
            }
        }
    }
};
