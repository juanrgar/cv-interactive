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
    }

    init() {
        this._main = document.getElementById("main");
        this._add_empty_line();
    }

    _add_empty_line() {
        let line = this._new_prompt_line();
        this._main.appendChild(line);
    }

    _new_prompt_line() {
        let line = document.createElement("div");
        line.id = "line" + this._line_nb;
        line.innerHTML = this._prompt;
        this._line_nb++;
        return line;
    }
}

const PROMPT = "~ guest$";

const shell = new Shell(PROMPT);

$(function() {
    shell.init();
});

