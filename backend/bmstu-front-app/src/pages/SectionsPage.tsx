import "./SectionsPage.css";
import { FC, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Badge } from "react-bootstrap";
import { Section, getSections } from "../modules/bmstuSportApi";
import SearchField from "../components/SearchField";
import { SearchComponent } from "../components/SearchComponent";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { SectionCard } from "../components/SectionCard";
import { useNavigate } from "react-router-dom";
import { SECTIONS_MOCK } from "../modules/mocks";
import NavigationBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SectionsPage: FC = () => {
//   const [searchValue, setSearchValue] = useState("");
  const searchValue = useSelector((state: RootState) => state.search.searchValue);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [applicationSectionsCounter, setApplicationSectionsCounter] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    getSections(searchValue)
        .then((response) => {
            setSections(response.sections);
            setApplicationSectionsCounter(response.number_of_sections);
            setLoading(false);
        })
        .catch(() => {
            setSections(SECTIONS_MOCK.sections);
            setLoading(false);
        });
  }, [searchValue])

//   const handleSearch = () => {
//     setLoading(true);
//     getSections(searchValue)
//       .then((response) => {
//         setSections(response.sections);
//         setLoading(false);
//       })
//       .catch(() => { // В случае ошибки используем mock данные, фильтруем по имени
//         setSections(
//             SECTIONS_MOCK.sections.filter((item) =>
//             item.title
//               .toLocaleLowerCase()
//               .startsWith(searchValue.toLocaleLowerCase())
//           )
//         );
//         setLoading(false);
//       });
//   };
//   const handleSearchSubmit = (searchValue: string) => {
//     setSearchValue(searchValue);
//     handleSearch();
//   };
//   const handleSearchSubmitV2 = (searchValue: string) => {
//     setSearchValue(searchValue);
//   };
  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.SECTIONS}/${id}`);
  };

  const handleApplicationButtonClick = () => {
    // должно появится в будующих лабах
    // navigate(`${ROUTES.APPLICATIONS}/${draftApplicationID}`);
  };

  const handleAddSection = (sectionId: number) => {
    console.log(sectionId)
    // должно появится в будующих лабах
    // addSectionToDraft(sectionId)
    //     .then((ok) => {
    //         if (ok) {
    //             setApplicationSectionsCounter(applicationSectionsCounter + 1);
    //         }
    //     })
  }

  return (
    <div>
        <NavigationBar/>
    <div className="cccontainer">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SECTIONS }]} />
      
        <div className="top-container">
            <div className="title">На этой неделе</div>
        </div>

        <div className="horizontal-container">
            {/* <SearchField
                value={searchValue}
                setValue={(value) => setSearchValue(value)}
                loading={loading}
                placeholder="Поиск по названию"
                onSubmit={handleSearch}
            /> */}
            <SearchComponent
                // onSearchValueChange={handleSearchSubmitV2}
            />

            <div className="btncontainer">
                {applicationSectionsCounter > 0 ? (
                    <Button variant="light" onClick={handleApplicationButtonClick}>
                        ЗАЯВКА <Badge bg="danger">{applicationSectionsCounter}</Badge>
                    </Button>
                ) : (
                    <Button variant="secondary">ЗАЯВКА</Button> // disabled
                )}
            </div>
        </div>

        {loading && ( // здесь можно было использовать тернарный оператор, но это усложняет читаемость
            <div className="loadingBg">
                <Spinner animation="border" />
            </div>
        )}
        {!loading &&
            (!sections.length /* Проверка на существование данных */ ? (
            <div>
                <h1>Такого курса на этой неделе не будет</h1>
            </div>
            ) : (
            <Row className="g-4">
                {sections.map((item, index) => (
                    <Col xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                        <SectionCard
                            key={item.pk}
                            sectionId={item.pk}
                            imageUrl={item.imageUrl}
                            title={item.title}
                            location={item.location}
                            date={item.date}
                            plusButtonClickHandler={() => handleAddSection(item.pk)}
                            imageClickHandler={() => handleCardClick(item.pk)}
                        />
                    </Col>
                ))}
            </Row>
        ))}
    </div>
    </div>
  );
};

export default SectionsPage;