# u14-Emoji-Game
### ⚠ Prototype

Emoji based game for unit 14.

```
Game name; Sharp Gunners
Objective; Last man standing
Type of fun;  Competiveness, winning, killing

About; Real time game, played on the same keyboard with 3 players. Each battles it out to be the last player alive by shooting rockets from physics based characters.
```

#### Coding
| Task | Completed/progress |
| ------------- | --------- |
| Create character with constraints, allowing it to support its self  | ✅ |
| Implement keyboard controls | ✅ |
| Implement shooting mechanics | ✅ |
| Implement mechanics to allow the player to adjust the rotation of the character in case of it falling over | ✅ |
| [CLASS: 3] Convert to classes, allowing the code to be expandable | ✅ - 3/3 |
| [CLASS: 1/3] Convert character to class | ✅ |
| [CLASS: 2/3] Add keystroke listeners to class | ✅ |
| [CLASS: 3/3] Add team colours to class | ✅ |
| [DISBANDED] Implement lives | 🚧 |
| Add collison detection for rockets | ✅ |
| [LIVES HAVE NOT BEEN IMPLEMENTED. PLAYERS MUST SHOOT THE OPPOSING PLAYER OFF THE MAP] Apply a positive force, relative to rocket speed to the part the rocket hits. ~~thus causing the opposing player to catipult in the opposite direction and loose a life~~ | ✅ |
| Create the map | ✅ |
| Create win/loose conditions | ✅ |
| Create main menu | ✅ |
| Implement win screen | ✅ |
| Implement method to display controls | ✅ |



#### Future ideas
| Task | Completed/progress |
| ------------- | --------- |
| Add sound effects  | ✅ |
| Add cannons and other obstacles to the map  | ❌ |
| Do away with lives and have the rockets, gradually destroy the player by deleting the surrounding blocks it collides with | ❌ |
| Rocket shooter cool down - x avaliable rockets in y seconds  | ❌ |


#### Testing
| Task | Completed/progress |
| ------------- | --------- |
| Test with 3 players | ✅ |

#### Optimization

`⚠ | NOTE: Where see revisions is written, screenshots will be included as to prove optimization`

| Task | Completed/progress |
| ------------- | --------- |
| Converting from procedual to class based, meaning the code is expandable. See revisions. | ✅ |
| Switch from `if` statements to `switch/case` statements, making the code more redable. See revisions. | ✅ |
| Do away with redundent variables | ✅ |
| Use ES6 modules with a seperate config.json file for settings, meaning the game mechanics can quickly be changed | ❌ |
| Minify code, do away with redundent CDNs like underscore - reducing load time | ❌ |
| Use ternary operators to increase code effeciency | ❌ |

#### Feedback
Ben Stotesbury; Spawn players in random locations

#### Update log
| Task | Date |
| ---- | ------- |
| Created mockup | 3 APR |
| Implemented keyboard controls | 4 APR |
| Implemented shooting mechanics | 4 APR |
| Worked on physics | 12 APR |
| Allowed player to right the character when it falls over | 25 APR |
| Code optimization - did away with redundent variables | 26 APR |
| Code optimization - converted to class based system and switched from `if` statements to `switch/case` statements | 27 APR |
| Created this readme.md document | 28 APR |
| Worked on bullet collision detection | 29 APR |
| Finished bullet detection | 29 APR |
| Added bullet collision explosion effects | 30 APR |
| Added indication to the characters to represent which team the player was on | 30 APR |
| Added expandable system, to place emojis where phyiscal instances should be | 1 MAY |
| Downsized characters by half | 2 MAY |
| Added functionality to have the barriers move | 12 MAY |
| Added emojis that displayed the controls | 13 MAY |
| Added win loose conditions | 13 MAY |
| Added win menu | 13 MAY |
