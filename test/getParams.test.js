import {getParams, isItemsUnique} from "../cliSrc/index.js";

describe('получение входных данных', () => {
    it('возвращает ошибку при отсутствии параметров', () => {
        expect(getParams([])).toEqual(expect.objectContaining({err: true}));
    });

    it('возвращает ошибку при отсутствии имени файла с параметрами', () => {
        expect(getParams(['-a'])).toEqual(expect.objectContaining({err: true}));
    });

    it('возвращает ошибку для некорректного файла с параметрами', () => {
        expect(getParams(['qqq'])).toEqual(expect.objectContaining({err: true}));
        expect(getParams(['-a', 'qqq'])).toEqual(expect.objectContaining({err: true}));
        expect(getParams(['err.json'])).toEqual(expect.objectContaining({err: true}));
    });

    it('считывает параметры', () => {
        expect(getParams(['./examples/small.json'])).toEqual(expect.objectContaining({
            "err": false,
            "findAll": false,
            "items": [["I", 2], ["N", 1], ["L", 1], ["P", 2]],
            "space": [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]
        }));

        expect(getParams(['-a', './examples/small.json'])).toEqual(expect.objectContaining({
            "err": false,
            "findAll": true,
            "items": [["I", 2], ["N", 1], ["L", 1], ["P", 2]],
            "space": [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]
        }));
    });

    it('преобразует параметры', () => {
        expect(getParams(['./examples/square1.json'])).toEqual(expect.objectContaining({
            "items": [["I", 2], ["N", 2], ["L", 2], ["U", 2], ["X", 2], ["W", 2], ["P", 2], ["F", 2], ["Z", 2], ["T", 2], ["V", 2], ["Y", 2]],
            "space": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
        }));
    });

    it('проверяет отсутствие дублей фигур', () => {
        expect(isItemsUnique([["I", 1], ["N", 1], ["L", 1], ["P", 1]])).toBe(true);
        expect(isItemsUnique([["I", 2], ["N", 1], ["L", 1], ["P", 2]])).toBe(false);
    });
});
