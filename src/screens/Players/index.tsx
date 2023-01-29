import {FlatList, TextInput} from 'react-native'
import {useState, useEffect, useRef} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native'
import { AppError } from '@utils/appError';

import {Alert} from 'react-native';

import {Container, Form, HeaderList, NumbersOfPlayers} from './styles'

import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/HighLight';
import { ListEmpty } from '@components/ListEmpty';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';
import { Button } from '@components/Button';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/PlayerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';

type  RouteParams = {
group: string
}

export function Players (){
const [isLoading, setIsLoading] = useState(true);
const [team, setTeam] = useState('TIME A');
const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
const [newPlayerName, setNewPlayerName] = useState('');
const newPlayerNameInputRef = useRef<TextInput>(null)

const navigation = useNavigation();
const route = useRoute();
const {group} = route.params as RouteParams;

async function handleAddPlayer () {
    if (newPlayerName.trim().length === 0){
    return  Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar')
     
    }
    const newPlayer = {
        name: newPlayerName,
        team,
    }
    try {
        await playerAddByGroup(newPlayer, group);

        newPlayerNameInputRef.current?.blur();

        setNewPlayerName('');

        handleAddPlayer();

    } catch (error) {
       if(error instanceof AppError){
        Alert.alert('Nova Pessoa', error.message)
       }else {
        console.log(error);
        Alert.alert('Nova Pessoa', 'Não foi possível adicionar')
       }

    }
}

async function fetchPlayersByTeam() {
    try {
        setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam)
      
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    }finally{
        setIsLoading(false);
    }
  }

  async function handlePlayerRemove (playerName: string) {
    try {
        await playerRemoveByGroup(playerName, group);
        fetchPlayersByTeam();

    } catch (error) {
        console.log(error);
        Alert.alert('Remover Pessoa', ' Não foi possível remover a pessoa selecionada')
    }
  }

  async function groupRemove () {
try {
    await groupRemoveByName(group);
    navigation.navigate('groups')
} catch (error) {
    console.log(error)
    Alert.alert('Remover Grupo', 'Não foi possível remover o grupo')
}
  }
  async function handleGroupRemove () {
    Alert.alert('Remover', 'Deseja remover o grupo', 
    [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: () => groupRemove() }
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team])

    return (
        <Container>
         <Header showBackButton/>
         
         <Highlight 
         title ={group} 
         subtitle="Adicione a galera e separe os times"
         />

        <Form>
         <Input
         inputRef={newPlayerNameInputRef}
         onChangeText={setNewPlayerName} 
         value={newPlayerName}
         placeholder='Nome da pessoa'
         autoCorrect={false}
         onSubmitEditing={handleAddPlayer}
         returnKeyType='done'
         />

         <ButtonIcon 
         icon="add" 
         onPress={handleAddPlayer}
         />
        </Form>
        
        <HeaderList>
           
            
        <FlatList 
        data={['TIME A', 'TIME B']}
        keyExtractor={item => item}
        renderItem={({item}) =>(
        <Filter 
        title ={item}
        isActive={item === team}
        onPress={() =>setTeam(item)}
        />
        )}
        horizontal
        />

        <NumbersOfPlayers>
            {players.length}
        </NumbersOfPlayers>
        </HeaderList>
        {
                isLoading ? <Loading /> : 
        <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
            <PlayerCard 
            name={item.name}
            onRemove={() => handlePlayerRemove(item.name)}
            />
        )}
            ListEmptyComponent = {() => (
                <ListEmpty 
                message='Não há pessoas nesse time'
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                {paddingBottom: 100},
                players.length === 0 && {flex: 1} 
            ]}
        />
    }
        <Button
        title='Remover Turma' 
        type='SECUNDARY'
        onPress={handleGroupRemove}
        />

        </Container>
    );
}