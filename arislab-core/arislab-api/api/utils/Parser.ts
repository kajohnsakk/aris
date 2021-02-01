/**
 * Created by touchaponk on 18/07/2017.
 */
const nGram = require('n-gram');
const intersection = require('array-intersection');
const union = require('array-union');

export class Parser {

    static jaccardSimilarity(word1: string, word2: string): number {

        let setNgramWord1 = nGram(2)(word1).concat(nGram(3)(word1));
        let setNgramWord2 = nGram(2)(word2).concat(nGram(3)(word2));

        return intersection(setNgramWord1, setNgramWord2).length;
    }

    static jaccardSimilarityArray(word_ngram_array: any, word2: string): number {

        let setNgramWord1 = word_ngram_array;
        let setNgramWord2: any = [];
        let word_count;
        for (word_count = 2; word_count <= word2.length; word_count++) {
            setNgramWord2 = setNgramWord2.concat(nGram(word_count)(word2));
        }

        let intersectionArray = intersection(setNgramWord1, setNgramWord2);

        let intersectionArrayScore = intersectionArray.map((ele: any) => {
            return ele.length * ele.length;
        });

        let score = intersectionArrayScore.reduce((a: number, b: number) => a + b, 0);

        return score;
    }

    static jaccardSimilarityNgramArray(word_ngram_array: any, word_field_ngram_array: any): number {

        let intersectionArray = intersection(word_ngram_array, word_field_ngram_array);

        let intersectionArrayScore = intersectionArray.map((ele: any) => {
            return ele.length * ele.length;
        });

        return intersectionArrayScore.reduce((a: number, b: number) => a + b, 0);
    }

    static jaccardPercentSimilarity(word1: string, word2: string): number {

        let setNgramWord1 = nGram(2)(word1).concat(nGram(3)(word1));
        let setNgramWord2 = nGram(2)(word2).concat(nGram(3)(word2));

        return (intersection(setNgramWord1, setNgramWord2).length / union(setNgramWord1, setNgramWord2).length) * 100;
    }

}