/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    // 自动清除 Mock
    clearMocks: true,

    // 开启覆盖率
    collectCoverage: true,

    // 指定生成覆盖率报告文件存放位置
    coverageDirectory: 'coverage',

    // 不用管
    coverageProvider: 'v8',
}
