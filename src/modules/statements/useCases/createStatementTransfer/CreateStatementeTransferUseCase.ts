import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
class CreateStatementeTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, sender_id, type, amount, description }: ICreateStatementDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);
    const usersender = await this.usersRepository.findById(sender_id!);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (!usersender) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id : sender_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperationTransfer = await this.statementsRepository.create({
      sender_id,
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    await this.statementsRepository.create({
      user_id : sender_id!,
      type: OperationType.WITHDRAW,
      amount,
      description
    })



    return statementOperationTransfer;



  }



}

export { CreateStatementeTransferUseCase}
