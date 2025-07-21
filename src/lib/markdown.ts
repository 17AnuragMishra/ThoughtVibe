import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: (str: string, lang: string) => {
    if (!lang && !hljs.getLanguage(lang)) return "";

    try {
        return hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true
        }).value;
    } catch (error) {
        console.log("Error Highlighting Language: ", error);
        throw error;
    }
  },
}); 