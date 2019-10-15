import { Controller, Get, Post, Render, Query } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from "@nestjs/swagger";

const PAGE_URL = 'user';

@ApiUseTags('ssr')
@Controller(PAGE_URL)
export class UserController {

    @Get('')
    @Render(PAGE_URL)
    @ApiOperation({ title: 'Index Page' })
    user() { }

    @Get('/publish/funding/:id')
    @Render(`${PAGE_URL}/publish/funding`)
    @ApiOperation({ title: 'publish' })
    publishFunding() { }

    @Get('/apply')
    @ApiOperation({ title: 'apply' })
    apply() { }

    @Get('/apply/project')
    @Render(`${PAGE_URL}/apply/project`)
    @ApiOperation({ title: 'apply project' })
    applyProject() { }

    @Get('/apply/product')
    @Render(`${PAGE_URL}/apply/product`)
    @ApiOperation({ title: 'apply product' })
    applyProduct() { }

    @Get('/apply/capital')
    @Render(`${PAGE_URL}/apply/capital`)
    @ApiOperation({ title: 'apply capital' })
    applyCapital() { }

    @Get('/apply/service')
    @Render(`${PAGE_URL}/apply/service`)
    @ApiOperation({ title: 'apply service' })
    applyService() { }

    @Get('/funding')
    @Render(`${PAGE_URL}/funding`)
    @ApiOperation({ title: 'user funding' })
    userFunding() { }

    @Get('/project')
    @Render(`${PAGE_URL}/project`)
    @ApiOperation({ title: 'user project' })
    userProject() { }

    @Get('/publish/funding')
    @Render(`${PAGE_URL}/publish/funding`)
    @ApiOperation({ title: 'user publish funding' })
    userPublishFunding(@Query() query) {
        return { id: query.id };
     }

    @Get('/publish/project')
    @Render(`${PAGE_URL}/publish/project`)
    @ApiOperation({ title: 'user publish project' })
    userPublishProject(@Query() query) {

        return { id: query.id };
    }
}
