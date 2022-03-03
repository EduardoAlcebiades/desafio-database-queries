import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder()
      .select("*")
      .where("LOWER(title) LIKE :title", {
        title: `%${param.toLowerCase()}%`,
      })
      .execute();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "user")
      .select([
        "user.id AS id",
        "user.first_name AS first_name",
        "user.last_name AS last_name",
        "user.email AS email",
        "user.created_at AS created_at",
        "user.updated_at AS updated_at",
      ])
      .where("game.id = :id", { id })
      .execute();
  }
}
