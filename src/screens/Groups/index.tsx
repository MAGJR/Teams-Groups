import {Alert} from 'react-native';
import { FlatList } from 'react-native';
import { groupsGettAll } from '@storage/group/groupsGetAll';
import { useState, useCallback } from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {Header} from '../../components/Header'
import { Button } from '@components/Button';
import { Container  } from './styles';
import { Highlight } from '../../components/HighLight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';


export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
const [groups, setGroups] = useState<string[]>([]);
const navigation = useNavigation()

function handleNewGroup() {
navigation.navigate('new')
}

async function FetchGroups () {
  try {
    setIsLoading(true)
    const data = await groupsGettAll();
    setGroups(data);
    

  }catch (error) {
    Alert.alert('Turmas', 'Não foi possível carregar as turmas')
  }finally{
    setIsLoading(false);
  }
}

function handleOpenGroup(group: string) {
navigation.navigate('players', {group})
}


useFocusEffect(useCallback(() => {
  FetchGroups()
},[]))

  return (
    <Container>
     <Header />

     <Highlight 
     title="Turmas"
     subtitle="Jogue com sua turma"
     />
     
     {
      isLoading ? <Loading /> :
     
     <FlatList 
     data={groups}
     keyExtractor={item => item}
     renderItem={({item}) => (
      <GroupCard
       title={item} 
       onPress={() => handleOpenGroup(item)}
       
       />
     )}
     contentContainerStyle={groups.length === 0 && {flex: 1} }
     ListEmptyComponent ={() => (
      <ListEmpty 
      message="Que tal cadastrar sua primeira turma?"/>
     )}
     />
     }
     
     <Button 
     title="Criar Nova Turma"
     onPress={handleNewGroup}
     />

    </Container>
  );
}