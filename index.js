// TODO
/*
[ ] quick add from hotkey
[ ] auto reload into karabiner.json
[x] read from external json

*/
import JSON5 from 'json5'
import fs from 'fs'
import {homedir} from 'os'
import commandLineArgs from 'command-line-args'
const chords = JSON5.parse(fs.readFileSync('./chords.json'))
const optionDefinitions = [
    { name: 'add', alias: 'a', type: Boolean },
    { name: 'update', alias: 'w', type: Boolean },
    { name: 'from', alias: 'f', type: String },
    { name: 'to', alias: 't', type: String },

  ]
const options = commandLineArgs(optionDefinitions)
const generateFile = () => {
    const json = {
        title: 'wChording',
        rules: [
            {
                description: "wChording - Chords",
                manipulators: []
            }
        ]
    }
    chords.forEach(chord => {

        let rule = {
            from: {
                modifiers: {
                    optional: ['any']
                },
                simultaneous: chord.from.split('').map(key => {
                    return { key_code: key }
                }),
            },
            to: chord.to.split('').map(key => {
                if(key === ' ') key = 'spacebar'
                return { 
                    key_code: key
                }
            }),
            type: 'basic'
        }
        
        json.rules[0].manipulators.push(rule)
    })
    return json
}

// Write file to Karabiner
const writeFileToKarabiner = () => {
    const generatedChords = generateFile()
    const generatedChordsString = JSON.stringify(generatedChords, null,4)
    // write to this folder
    fs.writeFileSync('./wChording.json',generatedChordsString)
    // write to karabiner comblex mods
    fs.writeFileSync(homedir+'/.config/karabiner/assets/complex_modifications/wChording.json',generatedChordsString, { flag: 'w' })
    // replace in the karabiner.json
    const karabinerjson = JSON.parse(fs.readFileSync(homedir+'/.config/karabiner/karabiner.json'))
    const clearedKjson = {
        ...karabinerjson,
    }
    clearedKjson.profiles[0].complex_modifications.rules = karabinerjson.profiles[0].complex_modifications.rules.filter(a=>a.description !== 'wChording - Chords');

    // add the new thing to the list
    clearedKjson.profiles[0].complex_modifications.rules = clearedKjson.profiles[0].complex_modifications.rules.concat(generatedChords.rules) // TODO: not only add first rule
    fs.writeFileSync(homedir+'/.config/karabiner/karabiner.json', JSON.stringify(clearedKjson,null,4), {flag:'w'})

    console.log("output located at wChording.json");
}

// console.log(options);

// add chord
if(options.from && options.to){
    const chordlist = JSON5.parse(fs.readFileSync('./chords.json'))
    chordlist.push({from: options.from, to: options.to})
    fs.writeFileSync('./chords.json',JSON.stringify(chordlist,null, 4))
    console.log('added chord');
}

if(options.update){
    writeFileToKarabiner()
}