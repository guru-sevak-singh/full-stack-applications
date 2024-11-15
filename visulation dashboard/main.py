import pandas as pd
from datetime import datetime, date


df = pd.read_excel('data.xlsx')

# print(df)

date1 = date(2022, 10, 1)
date2 = date(2022, 10, 5)

# Convert date1 and date2 to pandas.Timestamp for comparison
date1 = pd.Timestamp(date1)
date2 = pd.Timestamp(date2)

filter_df = df[(df['Day'] > date1) & (df['Day'] < date2)]

print(filter_df)

# result = df.to_dict(orient='records')


# print(result)
