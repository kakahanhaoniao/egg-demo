/**
 * created by liuhan
 * update by xiaoshao 2017/5/26
 */
'use strict';
const PassThrough = require('stream').PassThrough;
const {
    commonValidate
} = require('../validator');
const fetch = require('node-fetch');
// 设置校验规则
const validateRule = {
    // 相册列表
    albums: {
        isPage: {
            type: 'enum',
            values: [ 'true', 'false' ]
        },
        page: {
            type: 'object',
            required: false,
            rule: {
                pageSize: { type: 'integer', min: 1 },
                pageNo: { type: 'integer', min: 1 }
            }
        },
        query: {
            type: 'object',
            required: false,
            rule: {
                typeName: {
                    type: 'string',
                    required: false
                },
                orderName: {
                    type: 'enum',
                    values: [ 'typeName', 'typeCreatetime' ],
                    required: false
                },
                orderBy: {
                    type: 'enum',
                    values: [ 'asc', 'desc' ],
                    required: false
                }
            }
        }
    },
    // 图片列表
    getPictures: {
        isPage: {
            type: 'enum',
            values: [ 'true', 'false' ]
        },
        page: {
            type: 'object',
            required: false,
            rule: {
                pageSize: { type: 'integer', min: 1 },
                pageNo: { type: 'integer', min: 1 }
            }
        },
        query: {
            type: 'object',
            required: false,
            rule: {
                fileOriginalName: {
                    type: 'string',
                    required: false
                },
                fileTypeId: {
                    type: 'string',
                    required: false
                },
                isRelation: {
                    type: 'boolean',
                    required: false
                },
                fileCreateUserName: {
                    type: 'string',
                    required: false
                },
                orderName: {
                    type: 'enum',
                    required: false,
                    values: [ 'fileOriginalName', 'fileInsertTime' ]
                },
                orderBy: {
                    type: 'enum',
                    values: [ 'asc', 'desc' ]
                }
            }
        }
    }
};
module.exports = app => {
    class ImageController extends app.Controller {
        constructor(ctx) {
            super(ctx);
            // 注册验证规则
            this.app.registRules(commonValidate);
        }
        /**
         * @swagger
         * tags:
         *   - name: Image
         *     description: 图片模块
         */
        /**
         * @swagger
         * /image/albums:
         *   post:
         *     description: 获取相册列表
         *     tags:
         *       - Image
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           required:
         *             - isPage
         *           properties:
         *             isPage:
         *               type: string
         *               enum: ['true', 'false']
         *             page:
         *               type: object
         *               required:
         *                 - pageSize
         *                 - pageNo
         *               properties:
         *                 pageSize:
         *                   type: integer
         *                   default: 10
         *                 pageNo:
         *                   type: integer
         *                   default: 1
         *             query:
         *               type: object
         *               properties:
         *                 typeName:
         *                   type: string
         *                   description: 相册名搜索
         *                 orderName:
         *                   type: string
         *                   enum: ['typeName', 'typeCreatetime']
         *                   description: 排序字段，有效值：typeName（相册名） typeCreatetime（创建时间）
         *                 orderBy:
         *                   type: string
         *                   enum: ['asc', 'desc']
         *                   description: 排序规则，有效值：asc（升序） desc（降序）
         *     responses:
         *       200:
         *         description: 返回相册列表信息
         *         schema:
         *          type: object
         *          properties:
         *            page:
         *              type: object
         *              description: 主商品信息
         *            list:
         *              type: array
         *              description: 相册详细列表
         *              items:
         *                type: object
         *                properties:
         *                  typeCover:
         *                    type: string
         *                    description: 封面
         *                  typeName:
         *                    type: string
         *                    description: 名称
         *                  typeId:
         *                    type: string
         *                    description: 相册id
         *                  typeGenre:
         *                    type: string
         *                    description: 0:普通类型 1：用户默认相册  2：系统类型
         *                  sort:
         *                    type: integer
         *                    description: 排序
         */
        async albumList() {
            const ctx = this.ctx;
            // TODO validate
            ctx.validateWithThrow(validateRule.albums, ctx.request.body);
            try {
                const albums = await ctx.service.image.getAlbums(ctx.request.body);
                ctx.success({
                    albums
                });
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /image/albums/pictures:
         *   post:
         *     description: 获取图片列表
         *     tags:
         *       - Image
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         description: List of user object
         *         required: true
         *         schema:
         *           type: object
         *           required:
         *             - isPage
         *           properties:
         *             isPage:
         *               type: string
         *               enum: ['true', 'false']
         *             page:
         *               type: object
         *               properties:
         *                 pageSize:
         *                   type: integer
         *                   default: 10
         *                 pageNo:
         *                   type: integer
         *                   default: 1
         *             query:
         *               type: object
         *               properties:
         *                 fileOriginalName:
         *                   type: string
         *                   description: 查询对象，图片名查询
         *                 fileTypeId:
         *                   type: string
         *                   description: 查询对象，分类或相册ID
         *                 isRelation:
         *                   type: boolean
         *                   description: true(默认null)
         *                 fileCreateUserName:
         *                   type: string
         *                   description: 用户名
         *                 orderName:
         *                   type: string
         *                   enum: ['fileOriginalName', 'fileInsertTime']
         *                   description: 排序字段，有效值：fileOriginalName（图片名） fileInsertTime（创建时间）
         *                 orderBy:
         *                   type: string
         *                   enum: ['asc', 'desc']
         *                   description: 排序规则，有效值：asc（升序） desc（降序）
         *     responses:
         *       200:
         *         description: 返回图片列表信息
         *         schema:
         *          type: object
         *          properties:
         *            page:
         *              type: object
         *              description: 主商品信息
         *            list:
         *              type: array
         *              description: 相册详细列表
         *              items:
         *                type: object
         *                properties:
         *                  fileId:
         *                    type: string
         *                    description: 图片id
         *                  fileStr:
         *                    type: string
         *                    description: 图片系统名称
         *                  fileTypeId:
         *                    type: string
         *                    description: 图片所属类型或所属相册
         *                  fileOriginalUrl:
         *                    type: string
         *                    description: 相对URL
         *                  fileSize:
         *                    type: string
         *                    description: 大小单位KB
         *                  fileOriginalName:
         *                    type: string
         *                    description: a1.jpg(图片名称)
         *                  fileInsertTime:
         *                    type: string
         *                    description: 图片插入时间
         *                  fileFormat:
         *                    type: string
         *                    description: .jpg(图片格式)
         *                  fileDesc:
         *                    type: string
         *                    description: 图片描述
         *                  fileState:
         *                    type: string
         *                    description: 0：正常，1：禁用，状态
         *                  fileCreateUser:
         *                    type: string
         *                    description: 图片所属用户
         *                  relation:
         *                    type: string
         *                    description: 图片关联ID
         *                  sort:
         *                    type: string
         *                    description: 排序
         */
        async getPictures() {
            const ctx = this.ctx;
            // TODO validate
            ctx.validateWithThrow(validateRule.getPictures, ctx.request.body);
            try {
                ctx.success(await ctx.service.image.getAlbumPictures(ctx.request.body));
            } catch (err) {
                throw err;
            }
        }

        // for liuhan
        async proxyView() {
            const ctx = this.ctx;

            const res = await fetch(`${ctx.app.config.server.image}${ctx.query.path}`, {
                // headers: ctx.headers,
                method: 'GET',
                body: ctx.req
            });

            ctx.status = res.status;
            // 将响应的header 写回
            for (const k in res.headers.raw()) {
                ctx.res.setHeader(k, res.headers.get(k));
            }
            // fetch的res.body是个ReadableStream。
            // ctx.body = res.body 直接赋给body 可能fetch对象关闭的话会有问题。 因此要PipeThrough转存过来。
            ctx.body = res.body.on('error', ctx.onerror).pipe(PassThrough());
        }
    }
    return ImageController;
};
