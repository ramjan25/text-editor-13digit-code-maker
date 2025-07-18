document.getElementById('generateBtn').addEventListener('click', () => {
    const rawInput = document.getElementById('inputText').value.trim();
    if (!rawInput) {
        alert('Error: Please enter some input text.');
        return;
    }

    const lines = rawInput.split(/\r?\n/);
    let resultLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line === '') {
            continue;
        }

        if (line.toLowerCase().startsWith('line :')) {
            line = line.substring(6).trim();
        }

        if (!line.includes('|')) {
            alert(`Format Error: Line ${i + 1} format is incorrect.\nEach line should start with a 13-digit full code followed by | separated 4-digit codes.`);
            return;
        }

        const parts = line.split('|');
        const baseCode = parts[0].trim();

        if (!/^[A-Za-z0-9]{13}$/.test(baseCode)) {
            alert(`Format Error: Line ${i + 1} base code is not valid 13 characters: ${baseCode}`);
            return;
        }

        resultLines.push('');
        resultLines.push(baseCode);

        for (let j = 1; j < parts.length; j++) {
            const last4 = parts[j].trim();
            if (last4 === '') {
                continue;
            }
            if (!/^[A-Za-z0-9]{4}$/.test(last4)) {
                alert(`Format Error: Invalid 4-digit code '${last4}' in line ${i + 1}`);
                return;
            }
            const fullNewCode = baseCode.slice(0, -4) + last4;
            resultLines.push(fullNewCode);
        }

        resultLines.push('');
    }

    document.getElementById('outputText').value = resultLines.join('\n');
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('outputText').value;
    if (navigator.clipboard) { // Check for modern clipboard API
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Copied to clipboard!');
        }, (err) => {
            alert('Failed to copy text: ' + err);
        });
    } else { // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = outputText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } catch (err) {
            alert('Failed to copy text: ' + err);
        }
        document.body.removeChild(textArea);
    }
});