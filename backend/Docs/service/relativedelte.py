from datetime import date, datetime
from dateutil.relativedelta import relativedelta



# today = date(2026, 1, 18)
# get to the 1st day of the current month
# first_day = today + relativedelta(day=1)
# print(first_day)  # Output: 2026-01-01
# ------------------------------------------



#today = date(2026, 1, 18)    # given date 
today = date.today()  # get current date

next_month = today + relativedelta(months=1) # current date + one month  if months=2 will add two months
print(f"next_month...${next_month}")
# next_month will be 2026-02-18


#---------------------------------------------

today = date.today() # get current date 

print(f"today ... ${today}")

start_date = date(today.year, today.month, 1)   # Get first day of current month

print(f"start_date... ${start_date}")

# Get the first day of the next month, then subtract one day
last_day_of_month = start_date + relativedelta(months=1) - relativedelta(days=1)  #subtracts one real day  

print(f"last_day_of_month...${last_day_of_month}")

#-------------------------------------------------------

# Alternatively, a common variation is:
# toDayReplace = today.replace(day=1)  # Get first day of current month
# print(f"toDayReplace... ${toDayReplace}")

# last_day_of_month = (today.replace(day=1) + relativedelta(months=1) - relativedelta(days=1))

start_date = date(today.year, today.month, 1)
end_date = start_date + relativedelta(months=1) - relativedelta(days=1)

start_datetime = datetime.combine(start_date, datetime.min.time())
end_datetime = datetime.combine(end_date, datetime.max.time())

print(f"start_datetime ...${start_date} ---- end_datetime... ${end_datetime}")
# output like that start_datetime ...$2026-01-01 ---- end_datetime... $2026-01-31 23:59:59.999999
