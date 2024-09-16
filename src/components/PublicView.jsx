import React, { useState, Fragment } from 'react';
import { Combobox, Transition, RadioGroup } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';


const interests = [
  'History',
  'Nature',
  'Food',
  'Adventure',
  'Culture',
  'Relaxation',
  'Shopping',
  'Nightlife',
  'Art',
  'Music',
  'Sports',
  'Photography',
  'Wildlife',
  'Architecture',
  'Beaches',
];

const weatherOptions = [
  'Warm',
  'Tropical',
  'Snowy',
  'Cold',
  'Mild',
  'Dry',
  'Humid',
  'Sunny',
  'Rainy',
  'Windy',
];

function PublicView() {
  const [formData, setFormData] = useState({
    budget: '',
    local_budget: '',
    currency: 'USD',
    interests: [],
    trip_duration: '',
    preferred_weather: [],
    other_requirements: '',
    number_of_travelers: 1,
    traveling_with_children: false,
    number_of_children: 0,
    travel_type: 'INTERNATIONAL',
    residence_country: '',
  });

  const [interestsQuery, setInterestsQuery] = useState('');
  const [weatherQuery, setWeatherQuery] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredInterests = interestsQuery === ''
    ? interests
    : interests.filter((interest) =>
        interest.toLowerCase().includes(interestsQuery.toLowerCase())
      );

  const filteredWeather = weatherQuery === ''
    ? weatherOptions
    : weatherOptions.filter((weather) =>
        weather.toLowerCase().includes(weatherQuery.toLowerCase())
      );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleInterestsChange = (selectedInterests) => {
    setFormData((prevState) => ({
      ...prevState,
      interests: selectedInterests,
    }));
  };

  const handleWeatherChange = (selectedWeather) => {
    setFormData((prevState) => ({
      ...prevState,
      preferred_weather: selectedWeather,
    }));
  };
  const handlePrint = () => {
  window.print();
};


const handleTravelTypeChange = (value) => {
  setFormData((prevState) => ({
    ...prevState,
    travel_type: value.toUpperCase(),
    currency: value === 'INTERNATIONAL' ? 'USD' : prevState.currency,
  }));
};


    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        budget: formData.travel_type === 'INTERNATIONAL' ? parseFloat(formData.budget) : parseFloat(formData.local_budget),
        local_budget: formData.travel_type === 'INTERNATIONAL' ? parseFloat(formData.budget) : parseFloat(formData.local_budget),
        trip_duration: parseInt(formData.trip_duration),
        number_of_travelers: parseInt(formData.number_of_travelers),
        number_of_children: parseInt(formData.number_of_children),
      };

      const response = await axios.post('https://atlan-challenge-backend.vercel.app/generate_itinerary', submissionData);

      setItinerary(response.data);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Your Perfect Trip</h2>
        <p className="text-gray-600">Fill out the form below and let us plan your dream vacation!</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Travel Type
          </label>
          <RadioGroup value={formData.travel_type.toLowerCase()} onChange={handleTravelTypeChange} className="mt-2">
            <RadioGroup.Option value="international">
              {({ checked }) => (
                <span className={`${checked ? 'bg-blue-500 text-white' : 'bg-white'} 
    border border-gray-300 rounded-lg py-2 px-3 
    flex items-center justify-center text-sm font-medium uppercase 
    hover:scale-105 focus:outline-none sm:flex-1 cursor-pointer transition-transform duration-200`}
>
                  International

                </span>
              )}

            </RadioGroup.Option>
             <br/>
            <RadioGroup.Option value="domestic">
              {({ checked }) => (
                <span className={`${checked ? 'bg-blue-500 text-white' : 'bg-white'} 
    border border-gray-300 rounded-lg py-2 px-3 
    flex items-center justify-center text-sm font-medium uppercase 
    hover:scale-105 focus:outline-none sm:flex-1 cursor-pointer transition-transform duration-200`}>
                  Domestic
                </span>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        {formData.travel_type === 'DOMESTIC' && (
          <>
            <div className="mb-4">
              <label htmlFor="residenceCountry" className="block text-gray-700 text-sm font-bold mb-2">
                Country of Residence
              </label>
              <input
                type="text"
                id="residenceCountry"
                name="residence_country"
                value={formData.residence_country}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your country of residence"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="localBudget" className="block text-gray-700 text-sm font-bold mb-2">
                Budget (Local Currency)
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="local_budget"
                  name="local_budget"
                  value={formData.local_budget}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g. 5000"
                  required
                />
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded-r w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Currency"
                  required
                />
              </div>
            </div>
          </>
        )}
        {formData.travel_type === 'INTERNATIONAL' && (
          <div className="mb-4">
            <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">
              Budget (in USD)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g. 5000"
              required
              min="0"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="interests" className="block text-gray-700 text-sm font-bold mb-2">
            Interests (select multiple)
          </label>
          <Combobox value={formData.interests} onChange={handleInterestsChange} multiple>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(interests) => interests.join(', ')}
                  onChange={(event) => setInterestsQuery(event.target.value)}
                  placeholder="Search interests..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredInterests.length === 0 && interestsQuery !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredInterests.map((interest) => (
                      <Combobox.Option
                        key={interest}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={interest}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {interest}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
            Trip Duration (in days)
          </label>
          <input
            type="number"
            id="duration"
            name="trip_duration"
            value={formData.trip_duration}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g. 7"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfUsers" className="block text-gray-700 text-sm font-bold mb-2">
            Number of Travelers
          </label>
          <input
            type="number"
            id="numberOfUsers"
            name="number_of_travelers" 
            value={formData.number_of_travelers}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="traveling_with_children"
              checked={formData.traveling_with_children}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Traveling with children?</span>
          </label>
        </div>
        {formData.traveling_with_children && (
          <div className="mb-4">
            <label htmlFor="number_of_children" className="block text-gray-700 text-sm font-bold mb-2">
              Number of Children
            </label>
            <input
              type="number"
              id="number_of_children"
              name="number_of_children"
              value={formData.number_of_children}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="weather" className="block text-gray-700 text-sm font-bold mb-2">
            Preferred Weather (select multiple)
          </label>
          <Combobox value={formData.weather} onChange={handleWeatherChange} multiple>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(weather) => weather.join(', ')}
                  onChange={(event) => setWeatherQuery(event.target.value)}
                  placeholder="Search weather..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredWeather.length === 0 && weatherQuery !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredWeather.map((weather) => (
                      <Combobox.Option
                        key={weather}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={weather}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {weather}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
        <div className="mb-6">
          <label htmlFor="other_requirements" className="block text-gray-700 text-sm font-bold mb-2">
            Other Requirements
          </label>
          <textarea
            id="other_requirements"
            name="other_requirements"
            value={formData.other_requirements}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            placeholder="Any other preferences or requirements?"
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
      </form>


      {itinerary && (
        <>
        <br/>
        <br/>
        <div className="print-itinerary imt-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Generated Itinerary</h3>
          
          <pre className="whitespace-pre-wrap"><ReactMarkdown>{itinerary.details}</ReactMarkdown></pre>
          <br/>
          <br/>
          <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handlePrint}
    >
      Print Itinerary
    </button>
        </div>
        
        </>
      )}
      
    </div>


  );
}

export default PublicView;