import numpy as np
from pprint import pprint

from field import FieldCategory as FC

prof_file = open('prof.txt', 'r')
clean_file = open('substitutions.txt', 'r')

ENTRY_COLUMNS = ['id', 'name', 'university', 'phd', 'gender', 'type', 'joinyear', 'field']
FIELD_GROUP = {
  'Algorithms & Theory': FC.Theory,
  'Programming Languages': FC.Theory,
  'Artificial Intelligence': FC.AI,
  'Computer Vision': FC.AI,
  'Data Mining': FC.AI,
  'Machine Learning & Pattern Recognition': FC.AI,
  'Natural Language & Speech': FC.AI,
  'Databases': FC.Systems,
  'Distributed & Parallel Computing': FC.Systems,
  'Hardware & Architecture': FC.Systems,
  'Networks & Communications': FC.Systems,
  'Operating Systems': FC.Systems,
  'Real-Time & Embedded Systems': FC.Systems,
  'Software Engineering': FC.Systems
}

sub_map = dict()

# initialize substitutions
for sub in clean_file:
  if '#' in sub:
    continue

  sub = sub.rstrip()
  vals = sub.split(',')
  sub_map[vals[0]] = vals[1]


class Entry(object):

  def __init__(self, entry_string):
    values = entry_string.split(',')
    values = [(sub_map[x] if x in sub_map else x) for x in values]
    if len(values) != 8:
      raise Exception('entry error')
    entry_dict = dict(zip(ENTRY_COLUMNS, values))
    self.__dict__.update(entry_dict)

# Initialize raw professor data
prof_entries = []
for prof in prof_file:
  if '#' in prof:
    continue

  prof = prof.rstrip()
  prof_entry = Entry(prof)
  prof_entries.append(prof_entry)


def generate_schools_list():
  schools = set()
  top_schools = dict()
  for prof_entry in prof_entries:
    if prof_entry.university:
      schools.add(prof_entry.university)

      if prof_entry.university in top_schools:
        top_schools[prof_entry.university] += 1
      else:
        top_schools[prof_entry.university] = 1

    if prof_entry.phd:
      schools.add(prof_entry.phd)

  top_schools_list = [school for school in top_schools if top_schools[school] > 0]

  # Sort by number of professors in the database
  top_schools_list = sorted(top_schools_list, key=lambda school: top_schools[school], reverse=True)

  return top_schools_list

def generate_graph(field_filter=None):
  top_school_map = dict()
  top_schools = generate_schools_list()

  fields = dict()
  for idx in range(len(top_schools)):
    top_school_map[top_schools[idx]] = idx

  num_schools = len(top_school_map)
  adjacency = [[0 for _ in top_school_map] for _ in top_school_map]

  for prof_entry in prof_entries:
    if (prof_entry.phd in top_school_map and prof_entry.university in top_school_map
        and prof_entry.phd != prof_entry.university):

      if field_filter is None or (prof_entry.field in FIELD_GROUP and
            FIELD_GROUP[prof_entry.field] == field_filter):
        # add edge weight from uni towards phd
        adjacency[top_school_map[prof_entry.university]][top_school_map[prof_entry.phd]] += 1

  output = ','.join(top_schools) + '\n'
  output += '\n'.join([','.join([str(x) for x in row]) for row in adjacency])

  adj_file = open('adj.txt', 'w')
  adj_file.write(output)
  adj_file.close()
  return (top_schools, adjacency)

generate_schools_list()
generate_graph()