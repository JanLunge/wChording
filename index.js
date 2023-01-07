// TODO
/*
[ ] quick add from hotkey
[ ] auto reload into karabiner.json
[x] read from external json

*/
import JSON5 from 'json5'
import fs from 'fs'
const chords = JSON5.parse(fs.readFileSync('./chords.json'))

const generateFile = () => {
    const json = {
        title: 'wChording',
        rules: [
            {
                description: "Chording rules",
                manipulators: []
            }
        ]
    }
    chords.forEach(chord => {

        let rule = {
            modifiers: {
                optional: ['any']
            },
            simultaneous: chord.from.split('').map(key => {
                return { key_code: key }
            }),
            to: chord.to.split('').map(key => {
                if(key === ' ') key = 'spacebar'
                return { 
                    key_code: key
                }
            })
        }
        
        json.rules[0].manipulators.push(rule)
    })
    return JSON.stringify(json, null, 4)
}
fs.writeFileSync('./wChording.json',generateFile())
console.log("output located at wChording.json");
