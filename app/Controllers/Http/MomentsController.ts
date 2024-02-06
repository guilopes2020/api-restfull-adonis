import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'


export default class MomentsController {

  private validateOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async index({ response }: HttpContextContract) {
    const moments = await Moment.all()

    response.status(200)

    return {
      data: moments,
    }

  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body();
    const image = request.file('image', this.validateOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })
      body.image = imageName
    }
    const moment = await Moment.create(body)

    response.status(201)

    return {
      message: 'Momento criado com sucesso!',
      data: moment,
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id
    const moment = await Moment.find(id)

    if (!moment) {
      response.status(404)
      return {
        message: 'Momento nao encontrado'
      }
    }

    response.status(200)
    return {
      moment,
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    const body = request.body();
    moment.title = body.title
    moment.description = body.description

    if (moment.image != body.image || !moment.image) {

      const image = request.file('image', this.validateOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'), {
        name: imageName,

      })

      moment.image = imageName

      }
    }

    await moment.save()
    response.status(201)

    return {
      message: 'Momento atualizado com sucesso!',
      data: moment,
    }

  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()

    return {
      mesage: 'Momento deletado com sucesso!',
      data: moment,
    }
  }
}
