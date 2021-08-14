import {Request, Response} from "express"
import { container } from "tsyringe"
import { CreateStatementeTransferUseCase } from "./CreateStatementeTransferUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}


class CreateStatementeTransferController{

  async handle(request: Request, response: Response): Promise<Response>{
    const { amount, description } = request.body
    const id_dest  = request.params.id
    const { id } = request.user

    const createStatementeTransferUseCase = container.resolve(CreateStatementeTransferUseCase);

    const statement = await createStatementeTransferUseCase.execute({ user_id: id_dest, sender_id: id, type: OperationType.TRANSFER, amount, description})

    return response.status(201).json(statement);
  }


}

export { CreateStatementeTransferController }
