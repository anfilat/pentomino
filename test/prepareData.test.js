import {prepareData} from '../src/pentamino.js';
import {ErrorAreaGreaterFigures, ErrorAreaIs0, ErrorAreaNotDiv5} from "../src/errors";

describe('предварительная обработка входных данных', () => {
    it('возвращает ошибку для пустой области', () => {
        let space = [[]];
        expect(prepareData({}, space)).toEqual([null, new ErrorAreaIs0()]);

        space = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        expect(prepareData({}, space)).toEqual([null, new ErrorAreaIs0()]);
    });

    it('возвращает ошибку, если площадь не кратна 5', () => {
        const space = [
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
        ];
        expect(prepareData({I: 2}, space)).toEqual([null, new ErrorAreaNotDiv5()]);
    });

    it('возвращает ошибку, если площадь области больше площади фигур', () => {
        const space = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ];
        expect(prepareData({}, space)).toEqual([null, new ErrorAreaGreaterFigures()]);
        expect(prepareData({I: 1}, space)).toEqual([null, new ErrorAreaGreaterFigures()]);
    });

    xit('prepareData возвращает корректный результат', () => {
        const items = {I: 1, N: 1, L: 1, U: 1, X: 1, W: 1, P: 1, F: 1, Z: 1, T: 1, V: 1, Y: 1};
        const space = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
        ];
        expect(prepareData(items, space)).toEqual([null, new ErrorAreaGreaterFigures()]);
    });
});
