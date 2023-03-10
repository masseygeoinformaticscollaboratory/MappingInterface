import geocoder
import geopandas as gpd
import numpy as np
import pandas as pd
from pathlib import Path

def read_data():
    path = '../dataFiles'
    files = Path(path).glob('*.json')
    dfs = list()
    for f in files:
        file = open(f, "r")
        #if the file has not been read
        if file.readline() != 'read\n':
            data = pd.read_json(f, lines=True)
            data['file'] = f.stem
            dfs.append(data)
            line_prepender(f)
    if len(dfs) < 1:
        return pd.DataFrame(dfs)
    else:
        return clean_df(pd.concat(dfs, ignore_index=True))


def line_prepender(filename):
    #Adds 'read' to the first name of a file
    with open(filename, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write('read' + '\n' + content)


def clean_df(data: pd.DataFrame) -> gpd.GeoDataFrame:
    relations = data.get("relations")
    sentences = data.get("sentences")
    #creates empty dataframe to append data
    df = pd.DataFrame(
        columns=['place name', 'type of impact', 'impact place relation', 'tweet text', 'impact category'])
    i = 0
    for impacts in relations:
        [impact_list] = impacts
        [sentence] = sentences[i]
        for impact in impact_list:
            df = pd.concat([df, pd.DataFrame.from_records([get_impact_relations(impact, sentence)])])
        i += 1
    df['type of impact'] = df['type of impact'].apply(str.title)
    df = get_impact_category(df.reset_index(drop=True))
    df = get_coordinates(df.reset_index(drop=True))
    df.dropna(inplace=True)

    return create_gdf(df)


def get_impact_relations(impact_list, sentence):
    #Gets the impact relations based on location - if it is multiple words, simply use the given indices, otherwise we
    #need to add one to the ending index
    if impact_list[0] == impact_list[1]:
        impact = ' '.join(sentence[impact_list[0]:impact_list[1] + 1])
    else:
        impact = ' '.join(sentence[impact_list[0]:impact_list[1]])

    if impact_list[2] == impact_list[3]:
        place = ' '.join(sentence[impact_list[2]:impact_list[3] + 1])
    else:
        place = ' '.join(sentence[impact_list[2]:impact_list[3]])
    return {
        'place name': place,
        'type of impact': impact,
        'impact place relation': impact + " " + place,
        'tweet text': ' '.join(sentence),
    }


def get_impact_category(data):
    #This could be MUCH improved and not be hard coded. May need to add more words to each category as more data is received
    damage = ['Damage', 'Damages', 'Damaged', 'Collapse', 'Collapsed', 'Down', 'Destroyed', 'Destroy', 'Destroys']
    death = ['Dead', 'Killed', 'Kill', 'Kills', 'Die', 'Dies', 'Died', 'Loss', 'Loss Of Life', 'Death Toll', 'Claims',
             'Claim', 'Death', 'Deaths', 'Deads', 'Daed']
    fire = ['Fire', 'Fires', 'Flames', 'Flame', 'Blaze', 'Smoke']
    flood = ['Flood', 'Floods', 'Wash Away', 'Sweep Away', 'Submerge', 'Flood Hits']
    injury = ['Injured', 'Injury', 'Injuries', 'Injures', 'Hurt', 'Hurts']
    missing = ['Missing', 'Missing Person', 'Missing People']
    terrorism = ['Bombing', 'Bomb']
    trapped = ['Trap', 'Traps', 'Marooned', 'Maroon', 'Maroons', 'Stranded', 'Strands', 'Strand']

    for index, row in data.iterrows():
        impact = row["type of impact"]

        match impact:
            case impact if impact in damage:
                data.loc[[index], 'impact category'] = 'Damage'
            case impact if impact in death:
                data.loc[[index], 'impact category'] = 'Death'
            case impact if impact in fire:
                data.loc[[index], 'impact category'] = 'Fire'
            case impact if impact in flood:
                data.loc[[index], 'impact category'] = 'Flood'
            case impact if impact in injury:
                data.loc[[index], 'impact category'] = 'Injury'
            case impact if impact in missing:
                data.loc[[index], 'impact category'] = 'Missing'
            case impact if impact in terrorism:
                data.loc[[index], 'impact category'] = 'Terrorism'
            case impact if impact in trapped:
                data.loc[[index], 'impact category'] = 'Trapped'
            case _:
                data.loc[[index], 'impact category'] = 'Other'

    return data


def get_coordinates(data):
    data["latitude"] = np.nan
    data["longitude"] = np.nan

    for index, row in data.iterrows():
        #Looked at GeoTxt but it is not going to work
        g = geocoder.geonames(row['place name'], key='QuakeText')
        if g.current_result:
            data.loc[[index], 'latitude'] = g.lat
            data.loc[[index], 'longitude'] = g.lng
       # To identify which names are not being found in GeoNames - they are normally unusual/misspelled names
        # else:
       #     print("Unable to find:" + row['place name'] + ' in geonames')
    return data


def create_gdf(data: pd.DataFrame) -> gpd.GeoDataFrame:
    gdf = gpd.GeoDataFrame(
        data, crs='EPSG:4326', geometry=gpd.points_from_xy(data.longitude, data.latitude))
    gdf = gdf.drop(columns=["latitude", "longitude"])
    return gdf
