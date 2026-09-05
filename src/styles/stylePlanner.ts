import { CICC_TOKENS, type CICCStyleId, type CICCStyleToken } from "./ciccTokens";

export interface SelectionStylePlan {
  styleId: CICCStyleId;
  wordStyle?: string;
  outlineLevel?: number;
  run: Pick<CICCStyleToken, "asciiFont"|"eastAsiaFont"|"complexScriptFont"|"sizePt"|"eastAsiaSizePt"|"color"|"bold"|"italic"|"underline">;
  paragraph: Pick<CICCStyleToken, "leftIndentTwip"|"firstLineIndentTwip"|"spaceBeforeTwip"|"spaceAfterTwip"|"lineSpacingPt"|"keepWithNext"|"keepTogether">;
  listLevel?: number; bulletChar?: string;
}

export function planSelectionStyle(styleId: CICCStyleId): SelectionStylePlan {
  const token = CICC_TOKENS[styleId];
  return {
    styleId,
    wordStyle: token.wordStyle,
    outlineLevel: token.outlineLevel,
    run: { asciiFont: token.asciiFont, eastAsiaFont: token.eastAsiaFont, complexScriptFont: token.complexScriptFont, sizePt: token.sizePt, eastAsiaSizePt: token.eastAsiaSizePt, color: token.color, bold: token.bold, italic: token.italic, underline: token.underline },
    paragraph: { leftIndentTwip: token.leftIndentTwip, firstLineIndentTwip: token.firstLineIndentTwip, spaceBeforeTwip: token.spaceBeforeTwip, spaceAfterTwip: token.spaceAfterTwip, lineSpacingPt: token.lineSpacingPt, keepWithNext: token.keepWithNext, keepTogether: token.keepTogether },
    listLevel: token.listLevel, bulletChar: token.bulletChar,
  };
}
