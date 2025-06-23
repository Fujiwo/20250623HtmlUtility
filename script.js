// HTML to Markdown Converter
class HtmlMarkdownConverter {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Convert buttons
        document.getElementById('htmlToMd').addEventListener('click', () => this.convertHtmlToMarkdown());
        document.getElementById('mdToHtml').addEventListener('click', () => this.convertMarkdownToHtml());
        
        // Clear buttons
        document.getElementById('clearHtml').addEventListener('click', () => this.clearField('htmlInput'));
        document.getElementById('clearMarkdown').addEventListener('click', () => this.clearField('markdownInput'));
        
        // Copy buttons
        document.getElementById('copyMarkdown').addEventListener('click', () => this.copyToClipboard('markdownOutput'));
        document.getElementById('copyHtml').addEventListener('click', () => this.copyToClipboard('htmlOutput'));
    }

    convertHtmlToMarkdown() {
        const htmlInput = document.getElementById('htmlInput').value.trim();
        const markdownOutput = document.getElementById('markdownOutput');
        
        if (!htmlInput) {
            this.showError(markdownOutput, 'Please enter HTML content to convert');
            return;
        }

        try {
            const markdown = this.htmlToMarkdown(htmlInput);
            markdownOutput.value = markdown;
            this.showSuccess(markdownOutput);
        } catch (error) {
            this.showError(markdownOutput, 'Error converting HTML to Markdown: ' + error.message);
        }
    }

    convertMarkdownToHtml() {
        const markdownInput = document.getElementById('markdownInput').value.trim();
        const htmlOutput = document.getElementById('htmlOutput');
        
        if (!markdownInput) {
            this.showError(htmlOutput, 'Please enter Markdown content to convert');
            return;
        }

        try {
            const html = this.markdownToHtml(markdownInput);
            htmlOutput.value = html;
            this.showSuccess(htmlOutput);
        } catch (error) {
            this.showError(htmlOutput, 'Error converting Markdown to HTML: ' + error.message);
        }
    }

    htmlToMarkdown(html) {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        return this.processNode(tempDiv, '');
    }

    processNode(node, markdown) {
        for (let child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                markdown += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                markdown += this.convertElementToMarkdown(child);
            }
        }
        return markdown;
    }

    convertElementToMarkdown(element) {
        const tagName = element.tagName.toLowerCase();
        const content = this.processNode(element, '');
        
        switch (tagName) {
            case 'h1':
                return `\n# ${content}\n\n`;
            case 'h2':
                return `\n## ${content}\n\n`;
            case 'h3':
                return `\n### ${content}\n\n`;
            case 'h4':
                return `\n#### ${content}\n\n`;
            case 'h5':
                return `\n##### ${content}\n\n`;
            case 'h6':
                return `\n###### ${content}\n\n`;
            case 'p':
                return `\n${content}\n\n`;
            case 'strong':
            case 'b':
                return `**${content}**`;
            case 'em':
            case 'i':
                return `*${content}*`;
            case 'code':
                return `\`${content}\``;
            case 'pre':
                return `\n\`\`\`\n${content}\n\`\`\`\n\n`;
            case 'blockquote':
                return `\n> ${content.replace(/\n/g, '\n> ')}\n\n`;
            case 'ul':
                return `\n${this.processListItems(element, false)}\n`;
            case 'ol':
                return `\n${this.processListItems(element, true)}\n`;
            case 'li':
                return content;
            case 'a':
                const href = element.getAttribute('href') || '';
                return `[${content}](${href})`;
            case 'img':
                const src = element.getAttribute('src') || '';
                const alt = element.getAttribute('alt') || '';
                return `![${alt}](${src})`;
            case 'br':
                return '\n';
            case 'hr':
                return '\n---\n\n';
            case 'table':
                return this.processTable(element);
            case 'thead':
            case 'tbody':
            case 'tr':
            case 'th':
            case 'td':
                return content;
            default:
                return content;
        }
    }

    processListItems(listElement, isOrdered) {
        let result = '';
        let index = 1;
        
        for (let li of listElement.querySelectorAll('li')) {
            const content = this.processNode(li, '').trim();
            if (isOrdered) {
                result += `${index}. ${content}\n`;
                index++;
            } else {
                result += `- ${content}\n`;
            }
        }
        
        return result;
    }

    processTable(tableElement) {
        const rows = Array.from(tableElement.querySelectorAll('tr'));
        if (rows.length === 0) return '';
        
        let markdown = '\n';
        
        rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            const cellContents = cells.map(cell => this.processNode(cell, '').trim());
            
            markdown += '| ' + cellContents.join(' | ') + ' |\n';
            
            // Add header separator after first row if it contains th elements
            if (rowIndex === 0 && row.querySelector('th')) {
                markdown += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
            }
        });
        
        return markdown + '\n';
    }

    markdownToHtml(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
        
        // Bold and Italic
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Code
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        // Horizontal rule
        html = html.replace(/^---+$/gm, '<hr>');
        
        // Blockquotes
        html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Lists
        html = this.processMarkdownLists(html);
        
        // Paragraphs (simple approach)
        html = this.processMarkdownParagraphs(html);
        
        // Line breaks
        html = html.replace(/\n/g, '<br>\n');
        
        return html.trim();
    }

    processMarkdownLists(html) {
        // Unordered lists
        html = html.replace(/^(\s*)-\s+(.+)$/gm, '<li>$2</li>');
        html = html.replace(/(<li>.*<\/li>\s*)+/g, (match) => {
            return '<ul>\n' + match + '</ul>\n';
        });
        
        // Ordered lists
        html = html.replace(/^(\s*)\d+\.\s+(.+)$/gm, '<li>$2</li>');
        html = html.replace(/(<li>.*<\/li>\s*)+/g, (match) => {
            if (!match.includes('<ul>')) {
                return '<ol>\n' + match + '</ol>\n';
            }
            return match;
        });
        
        return html;
    }

    processMarkdownParagraphs(html) {
        // Split by double newlines to identify paragraphs
        const blocks = html.split(/\n\s*\n/);
        return blocks.map(block => {
            block = block.trim();
            if (!block) return '';
            
            // Don't wrap if it's already HTML tags
            if (block.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr)/)) {
                return block;
            }
            
            return `<p>${block}</p>`;
        }).join('\n\n');
    }

    clearField(fieldId) {
        document.getElementById(fieldId).value = '';
        // Also clear corresponding output
        if (fieldId === 'htmlInput') {
            document.getElementById('markdownOutput').value = '';
        } else if (fieldId === 'markdownInput') {
            document.getElementById('htmlOutput').value = '';
        }
    }

    async copyToClipboard(fieldId) {
        const field = document.getElementById(fieldId);
        const content = field.value;
        
        if (!content) {
            this.showError(field, 'Nothing to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(content);
            this.showSuccess(field, 'Copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            field.select();
            document.execCommand('copy');
            this.showSuccess(field, 'Copied to clipboard!');
        }
    }

    showSuccess(element, message = '') {
        element.classList.remove('error');
        element.classList.add('success');
        if (message) {
            const originalPlaceholder = element.placeholder;
            element.placeholder = message;
            setTimeout(() => {
                element.placeholder = originalPlaceholder;
                element.classList.remove('success');
            }, 2000);
        } else {
            setTimeout(() => {
                element.classList.remove('success');
            }, 1000);
        }
    }

    showError(element, message) {
        element.classList.remove('success');
        element.classList.add('error');
        const originalPlaceholder = element.placeholder;
        element.placeholder = message;
        setTimeout(() => {
            element.placeholder = originalPlaceholder;
            element.classList.remove('error');
        }, 3000);
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HtmlMarkdownConverter();
});