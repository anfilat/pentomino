import {prepareData, ErrorAreaGreaterFigures, ErrorAreaIs0, ErrorAreaNotDiv5} from '../dlx/index.js';

describe('предварительная обработка входных данных', () => {
    it('возвращает ошибку для пустой области', () => {
        let space = [[]];
        expect(prepareData([], space)).toEqual([null, new ErrorAreaIs0()]);

        space = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        expect(prepareData([], space)).toEqual([null, new ErrorAreaIs0()]);
    });

    it('возвращает ошибку, если площадь не кратна 5', () => {
        const space = [
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
        ];
        expect(prepareData([['I', 2]], space)).toEqual([null, new ErrorAreaNotDiv5()]);
    });

    it('возвращает ошибку, если площадь области больше площади фигур', () => {
        const space = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ];
        expect(prepareData([], space)).toEqual([null, new ErrorAreaGreaterFigures()]);
        expect(prepareData([['I', 1]], space)).toEqual([null, new ErrorAreaGreaterFigures()]);
    });
});
