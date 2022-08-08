import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeInsert } from './interfaces/poke-insert.interface';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}


  async executeSeed() {

    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    // const insertPromisesArray = [];
    const pokemonToInsert: PokeInsert[] = [];

    data.results.forEach(({name , url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      //await this.pokemonModel.create({no, name});
      // insertPromisesArray.push(this.pokemonModel.create({no, name}))
      pokemonToInsert.push({name, no});
    })

    // await Promise.all(insertPromisesArray);
    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return { seed: 'Seed Executed'};
  }

  
}
