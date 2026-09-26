import { useState } from 'react';
import * as React from 'react';
import {View, Image} from 'react-native';
import { Text, ToggleButton, Chip, Card, Button, BottomNavigation} from 'react-native-paper';
import * as data from './data.json';
import { SafeAreaView } from 'react-native-web';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Cambiar texto</Text>;

export default function Inicio() {
    
    const [value, setValue] = useState('left');
    
    const [index, setIndex] = React.useState(0);
    
    const [routes] = React.useState([
        { key: 'music', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
        { key: 'albums', title: 'Buscar', focusedIcon: 'card-search' },
        { key: 'recents', title: 'Libreria', focusedIcon: 'music-box-multiple' },
        { key: 'notifications', title: 'Perfil', focusedIcon: 'account-outline', unfocusedIcon: 'account-outline' },
    ]);
    
    const renderScene = BottomNavigation.SceneMap({
        music: MusicRoute,
        albums: AlbumsRoute,
        recents: RecentsRoute,
        notifications: NotificationsRoute,
    });
    
    return(
        // Agregar Chips conforme a lista de categorias
        <SafeAreaView>
        <View>
        <Text variant="titleLarge">Hola, usuario ✨</Text>
        <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
        <ToggleButton icon="bell" value="left" />
        <ToggleButton icon="email" value="right" />
        </ToggleButton.Row>
        
        <View>
        <Text variant="titleLarge">Selecciona</Text>
        <View>
        
        <Chip>Todas</Chip>
        <Chip>Hip Hop</Chip>
        <Chip>Fiesta</Chip>
        
        </View>
        
        <View>
        <View>
        <Text variant="titleLarge">Canciones Populares</Text>
        <Button icon="chevron-right" mode="text" onPress={() => console.log('Pressed')}>Todas</Button>
        </View>
        <View>
        <Card>
        
        <Card.Content>
        <Image source={
            {uri:"https://cdn.shoplightspeed.com/shops/617250/files/50715333/1600x2048x2/republic-weeknd-starboy-lp.jpg"}
        }></Image>z
        </Card.Content>
        <Card.Title title="Starboy" subtitle="The Weekend"></Card.Title>
        </Card>
        </View>
        </View>

        <View>
            <Text variant="displayMedium">Nueva Colección</Text>
            <Card>
                <Card.Content>
                    <Text variant="bodyMedium">Top Songs Global</Text>
                    <Text variant="bodySmall">Discover 85 Songs</Text>
                    <Button>Next</Button>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text variant="bodyMedium">Top Songs Global</Text>
                    <Text variant="bodySmall">Discover 85 Songs</Text>
                    <Button>Next</Button>
                </Card.Content>
            </Card>
        </View>
        
        
        </View>
        <BottomNavigation navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}>
        
        </BottomNavigation>
        </View>
        </SafeAreaView>
    )
}