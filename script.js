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

        this._caret_timer = null;
    }

    init() {
        this._main = document.getElementById("main");
        document.addEventListener('keypress', this._on_keypress.bind(this));
        document.addEventListener('keydown', this._on_keydown.bind(this));
        this._add_empty_line();
    }

    _add_empty_line() {
        let line = this._new_prompt_line();
        this._main.appendChild(line);
        this._start_cursor();
    }

    _new_prompt_line() {
        let line = document.createElement("div");
        line.id = "line" + this._line_nb;
        line.innerHTML = this._prompt;
        this._line_nb++;
        return line;
    }

    _start_cursor() {
        this._caret_timer = setInterval(this._blink_cursor.bind(this), CURSOR_INTERVAL);
    }

    _blink_cursor() {
        let last_line = this._main.lastChild.innerHTML;
        if (last_line.charAt(last_line.length - 1) == CURSOR_CHAR) {
            last_line = last_line.substring(0, last_line.length - 1);
        } else {
            last_line += CURSOR_CHAR;
        }
        this._main.lastChild.innerHTML = last_line;
    }

    _on_keypress(e) {
    }

    _on_keydown(e) {
    }
}

const PROMPT = "~ guest$";
const CURSOR_INTERVAL = 600;
const CURSOR_CHAR = '|';

const shell = new Shell(PROMPT);

$(function() {
    shell.init();
});

