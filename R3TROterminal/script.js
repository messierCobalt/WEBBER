const terminal = document.getElementById('terminal');
    const bootLines = [
      "BOOTING UP..."
    ];
    let lineIdx = 0, charIdx = 0;

    function scrollToBottom() {
      terminal.scrollTop = terminal.scrollHeight;
    }

    function typeLine(text, cb) {
      const div = document.createElement('div');
      div.className = 'line';
      terminal.appendChild(div);
      function step() {
        if (charIdx < text.length) {
          div.textContent += text[charIdx++];
          scrollToBottom();
          setTimeout(step, 40);
        } else {
          charIdx = 0;
          cb && cb();
        }
      }
      step();
    }

    function bootSequence() {
      if (lineIdx < bootLines.length) {
        typeLine(bootLines[lineIdx++], bootSequence);
      } else {
        promptInput();
      }
    }

    function promptInput() {
      const container = document.createElement('div');
      container.className = 'line';
      container.innerHTML = '> <input type="text" id="userInput" autofocus /><span class="cursor"></span>';
      terminal.appendChild(container);
      scrollToBottom();

      const input = document.getElementById('userInput');
      input.focus();
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim();
          replaceInputWithText(cmd, container);
          handleCommand(cmd);
        }
      });
    }

    function replaceInputWithText(text, container) {
      const out = document.createElement('div');
      out.className = 'line';
      out.textContent = `> ${text}`;
      terminal.replaceChild(out, container);
      scrollToBottom();
    }

    function handleCommand(raw) {
      const cmd = raw.toLowerCase();
      const output = document.createElement('div');
      output.className = 'line';

      if (cmd === 'help') {
        output.textContent = 'Commands: help, echo [text], clear';
      } else if (cmd.startsWith('echo ')) {
        output.textContent = raw.slice(5);
      } else if (cmd === 'clear') {
        terminal.innerHTML = '';
        lineIdx = 0;
        charIdx = 0;
        bootSequence();
        return;
      } else {
        output.textContent = `cmdNotFound -> ${raw}`;
      }

      terminal.appendChild(output);
      scrollToBottom();
      promptInput();
    }

    bootSequence();

// AIgen