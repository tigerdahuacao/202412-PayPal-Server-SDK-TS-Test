import { Express, Request, Response, Router } from 'express'

// 路由配置接口
interface RouterConf {
    path: string
    router: Router
    meta?: unknown
}

// 路由配置
const routerConf: Array<RouterConf> = []

function routes(app: Express) {
    // 根目录
    app.get('/', (req: Request, res: Response) =>
        res.status(200).send('Please Use pnpm run test to do test'),
    )

    routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes
