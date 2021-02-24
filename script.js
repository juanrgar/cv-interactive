/**
 * This file is part of cv-interactive.
 *
 * Copyright (C) 2021 Juan R. García Blanco <juanrgar@gmail.com>
 *
 * cv-interactive is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * cv-interactive is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cv-interactive.  If not, see <https://www.gnu.org/licenses/>.
 */

class Shell {
    constructor(prompt) {
        this._prompt = prompt;

        this._main = null;
        this._line_nb = 0;
        this._col_nb = 0

        this._cursor_timer = null;

        this._commands = {
            'ls': this._cmd_ls,
            'pwd' : this._cmd_pwd,
            'cat' : this._cmd_cat
        };
    }

    init() {
        this._main = document.getElementById("main");
        document.addEventListener('keypress', this._on_keypress.bind(this));
        document.addEventListener('keydown', this._on_keydown.bind(this));
        this._add_prompt_line();
        this._start_cursor();
    }

    _add_line(text = '', cls = CSS_CLASS_PROMPT) {
        let line = document.createElement("div");
        line.id = "line" + this._line_nb;
        line.innerHTML = text;
        line.className = cls;
        this._line_nb++;
        this._col_nb = 0;
        this._main.appendChild(line);
        return line;
    }

    _add_prompt_line() {
        this._add_line(this._prompt);
    }

    _start_cursor() {
        this._cursor_timer = window.setInterval(this._blink_cursor.bind(this), CURSOR_INTERVAL);
    }

    _stop_cursor() {
        window.clearInterval(this._cursor_timer);
        let last_line = this._get_last_line();
        if (last_line.charAt(last_line.length - 1) == CURSOR_CHAR) {
            last_line = last_line.substring(0, last_line.length - 1);
        }
        this._set_last_line(last_line);
    }

    _blink_cursor() {
        let last_line = this._get_last_line();
        if (last_line.charAt(last_line.length - 1) == CURSOR_CHAR) {
            last_line = last_line.substring(0, last_line.length - 1);
        } else {
            last_line += CURSOR_CHAR;
        }
        this._set_last_line(last_line);
    }

    _on_keypress(e) {
        if (e.charCode == CHAR_CR) {
            this._enter();
        } else {
            let ch = String.fromCharCode(e.charCode);
            this._append_to_current_line(ch);
        }
        this._start_cursor();
    }

    _on_keydown(e) {
        this._stop_cursor();
        let handled = false;
        if (e.keyCode == CHAR_BS) {
            this._backspace();
            handled = true;
        } else if (e.keyCode == CHAR_TAB) {
            this._tab();
            handled = true;
        }

        if (handled) {
            this._start_cursor();
        }
    }

    _append_to_current_line(ch) {
        let line = this._get_last_line();
        line += ch;
        this._set_last_line(line);
        this._col_nb++;
    }

    _get_last_line() {
        let line = this._main.lastChild.innerHTML;
        line = line.replaceAll(HTML_SPACE, ' ');
        return line;
    }

    _set_last_line(line) {
        line = line.replaceAll(' ', HTML_SPACE);
        this._main.lastChild.innerHTML = line;
    }

    _enter() {
        let last_line = this._get_last_line();
        let cmd = last_line.substring(PROMPT.length);
        this._process_line(cmd, function() {
            this._add_prompt_line();
        }.bind(this));
    }

    _backspace() {
        let last_line = this._get_last_line();
        if (last_line.length > PROMPT.length) {
            last_line = last_line.substring(0, last_line.length - 1);
            this._set_last_line(last_line);
            this._col_nb--;
        }
    }

    _tab() {
    }

    _process_line(line, cont_cb) {
        if (line.length == 0) {
            return;
        }

        line = line.trim();
        console.log(line);
        let cmd = line.split(' ')[0];

        if (cmd in this._commands) {
            let fn = this._commands[cmd];
            let args = line.substring(cmd.length).trim().split(' ');
            console.log(args);
            fn.call(this, args, cont_cb);
        } else {
            this._add_line('Command not found: ' + cmd, CSS_CLASS_CMD_OUT);
        }
    }

    _cmd_ls(args, cont_cb) {
        this._add_line('intro  skills  education  languages  work', CSS_CLASS_CMD_OUT);
        cont_cb.call(this);
    }

    _cmd_pwd(args, cont_cb) {
        console.log(args);
        cont_cb.call(this);
    }

    _cmd_cat(args, cont_cb) {
        console.log(args);
        for (const filename of args) {
            this._request_file(filename,
                function(text) {
                    const lines = text.split('\n');
                    for (let l of lines) {
                        this._add_line(l, CSS_CLASS_CMD_OUT);
                    }
                    cont_cb.call(this);
                }.bind(this), 
                function() {
                    this._add_line('cat: ' + filename + ': No such file or directory', CSS_CLASS_CMD_OUT);
                    cont_cb.call(this);
                }.bind(this));
        }
    }

    _request_file(filename, done_cb, not_found_cb) {
        let request = new XMLHttpRequest;
        request.onload = function() {
            if (request.status == 200) {
                done_cb(request.responseText);
            } else {
                not_found_cb();
            }
        };

        request.open('GET', 'sections/' + filename + '.html');
        request.send();
    }
}

const PROMPT = "juanrgar@nebuchadnezzar ~$ ";
const CURSOR_INTERVAL = 600;
const CURSOR_CHAR = '|';
const CHAR_BS = 8;
const CHAR_TAB = 9;
const CHAR_CR = 13;
const CHAR_SPACE = 32;
const HTML_SPACE = '&nbsp;';
const CSS_CLASS_PROMPT = 'prompt';
const CSS_CLASS_CMD_OUT = 'cmd-out';

const shell = new Shell(PROMPT);

$(function() {
    shell.init();
});
