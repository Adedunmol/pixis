import { Prisma } from "@prisma/client"

export type SuperMemoItem = {
    nextInterval: number;
    repetition: number;
    eFactor: number;
}

/*
    0: 'complete blackout',
    1: 'incorrect response; the correct one remembered',
    2: 'incorrect response; correct one seemed easy to recall',
    3: 'correct response with difficulty',
    4: 'correct response after hesitation',
    5: 'perfect response'

    https://super-memory.com/english/ol/sm2.htm
*/

export type superMemoGrade = 0 | 1 | 2 | 3 | 4 | 5

export function superMemo(item: SuperMemoItem, grade: superMemoGrade): SuperMemoItem {

    // efactor should be within the range of 1.3 - 2.5
    // 1.3 - hard to recall
    // 2.5 - easy to recall

    let nextInterval: number; // This represents when next to show this card to the user (days)
    let repetition: number; // This represents how many times this card has been reviewed
    let eFactor: number; // (easiness-factor) This represents how easy it was to recall this card; the answer

    if (grade >= 3) {
        if (item.repetition === 0) {
            // if first time seeing this card, set nextInterval to 1 and increment repetition
            nextInterval = 1
            repetition = 1
        } else if (item.repetition === 1) {
            // if second time seeing this card, set nextInterval to 6 and increment repetition
            nextInterval = 6
            repetition = 2
        } else {
            nextInterval = Math.round(item.eFactor * item.nextInterval) // inter-repetition interval after the n-th repetition (in days)
            repetition = item.repetition + 1
        }
    } else {
        // if grade was lower than 3, start repetition from the beginning as if it was new
        nextInterval = 1 // review the next day as if it was being newly added
        repetition = 0 // newly added
    } 

    eFactor = item.eFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)) // the new efactor for this card

    if (eFactor < 1.3) eFactor = 1.3 // to reduce repeating a card too often

    return {
        nextInterval, // use this as an input to the cron sending notifications or mails
        repetition: repetition,
        eFactor
    }
}