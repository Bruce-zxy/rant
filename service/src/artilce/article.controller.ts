import { Controller } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { Crud } from "@nestjsx/crud";
import { BaseController } from "../core";
import { Article } from "../database";
import { ArticleService } from "./article.service";

@Crud({
    model: {
        type: Article
    },
    params: {
        id: {
            field: 'id',
            type: 'uuid',
            primary: true,
        },
    },
    query: {
        limit: 10,
        maxLimit: 100,
        cache: 10 * 1000,
        sort: [
            {
                field: 'sort',
                order: 'DESC',
            },
            {
                field: 'create_at',
                order: 'DESC',
            },
        ],
        join: {
            category: {}
        }
    }
})
@ApiUseTags('article')
@Controller('/api/article')
export class ArticleController extends BaseController<Article> {
    constructor(public service: ArticleService) {
        super(service)
    }
}